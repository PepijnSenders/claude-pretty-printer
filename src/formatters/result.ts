import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { colors } from '../colors';
import { isHeaderLayout, isMinimalLayout, shouldShowStats } from '../utils';

export function formatResultMessage(message: Extract<SDKMessage, { type: 'result' }>): string {
  // Header-only layout: return empty string (header shown by index.ts)
  if (isHeaderLayout()) {
    return '';
  }

  // Minimal layout: single line with status and cost
  if (isMinimalLayout()) {
    const statusIcon = message.subtype === 'success' ? colors.success('✓') : colors.error('✗');
    const cost = `$${message.total_cost_usd.toFixed(4)}`;
    return `${statusIcon} ${message.subtype} (${colors.warning(cost)})`;
  }

  const lines: string[] = [];

  if (message.subtype === 'success') {
    lines.push(colors.success('✓ Task completed successfully'));
    lines.push(`\n${colors.bold('Result:')} ${message.result}`);
  } else if (message.subtype === 'error_max_turns') {
    lines.push(colors.error('✗ Error: Maximum turns reached'));
  } else if (message.subtype === 'error_during_execution') {
    lines.push(colors.error('✗ Error during execution'));
  }

  // Skip stats if --no-stats flag is set or layout doesn't show stats
  if (!shouldShowStats()) {
    return lines.join('\n');
  }

  lines.push(`\n${colors.bold('Statistics:')}`);
  lines.push(`  ${colors.muted('Duration:')} ${(message.duration_ms / 1000).toFixed(2)}s`);
  lines.push(`  ${colors.muted('API Time:')} ${(message.duration_api_ms / 1000).toFixed(2)}s`);
  lines.push(`  ${colors.muted('Turns:')} ${message.num_turns}`);
  lines.push(
    `  ${colors.muted('Cost:')} ${colors.warning(`$${message.total_cost_usd.toFixed(4)}`)}`
  );

  // Token usage
  lines.push(`\n${colors.bold('Token Usage:')}`);
  lines.push(`  ${colors.muted('Input:')} ${message.usage.input_tokens.toLocaleString()}`);
  lines.push(`  ${colors.muted('Output:')} ${message.usage.output_tokens.toLocaleString()}`);
  if (message.usage.cache_read_input_tokens) {
    lines.push(
      `  ${colors.muted('Cache Read:')} ${colors.secondary(message.usage.cache_read_input_tokens.toLocaleString())}`
    );
  }
  if (message.usage.cache_creation_input_tokens) {
    lines.push(
      `  ${colors.muted('Cache Creation:')} ${message.usage.cache_creation_input_tokens.toLocaleString()}`
    );
  }

  // Model-specific usage
  if (Object.keys(message.modelUsage).length > 0) {
    lines.push(`\n${colors.bold('Per-Model Usage:')}`);
    for (const [model, usage] of Object.entries(message.modelUsage)) {
      lines.push(`  ${colors.primary(model)}:`);
      lines.push(`    ${colors.muted('Input:')} ${usage.inputTokens.toLocaleString()}`);
      lines.push(`    ${colors.muted('Output:')} ${usage.outputTokens.toLocaleString()}`);
      if (usage.cacheReadInputTokens) {
        lines.push(
          `    ${colors.muted('Cache Read:')} ${colors.secondary(usage.cacheReadInputTokens.toLocaleString())}`
        );
      }
      if (usage.cacheCreationInputTokens) {
        lines.push(
          `    ${colors.muted('Cache Creation:')} ${usage.cacheCreationInputTokens.toLocaleString()}`
        );
      }
      lines.push(`    ${colors.muted('Cost:')} ${colors.warning(`$${usage.costUSD.toFixed(4)}`)}`);
    }
  }

  // Permission denials
  if (message.permission_denials.length > 0) {
    lines.push(
      `\n${colors.bold(colors.error('Permission Denials:'))} ${message.permission_denials.length}`
    );
    for (const denial of message.permission_denials) {
      lines.push(
        `  ${colors.error('•')} ${denial.tool_name} ${colors.muted(`(${denial.tool_use_id})`)}`
      );
    }
  }

  return lines.join('\n');
}
