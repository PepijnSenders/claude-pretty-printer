import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { colors } from '../colors';
import { isHeaderLayout, isMinimalLayout } from '../utils';
import { formatHookMessage } from './hooks';

export function formatSystemMessage(message: Extract<SDKMessage, { type: 'system' }>): string {
  // Header-only layout: return empty string (header shown by index.ts)
  if (isHeaderLayout()) {
    return '';
  }

  if (message.subtype === 'init') {
    // Minimal layout: single line summary
    if (isMinimalLayout()) {
      return `Session ${message.session_id.slice(0, 8)}... ${colors.primary(message.model)}`;
    }

    const lines: string[] = [];
    lines.push(`\n${colors.bold('Claude Code Session Initialized')}`);
    lines.push(`\n${colors.muted('Session ID:')} ${message.session_id}`);
    lines.push(`${colors.muted('Version:')} ${message.claude_code_version}`);
    lines.push(`${colors.muted('Model:')} ${colors.primary(message.model)}`);
    lines.push(`${colors.muted('Working Directory:')} ${message.cwd}`);
    lines.push(`${colors.muted('Permission Mode:')} ${message.permissionMode}`);
    lines.push(`${colors.muted('API Key Source:')} ${message.apiKeySource}`);

    if (message.tools.length > 0) {
      lines.push(`\n${colors.muted('Available Tools:')} ${message.tools.length}`);
    }

    if (message.mcp_servers.length > 0) {
      lines.push(`\n${colors.bold('MCP Servers:')}`);
      for (const server of message.mcp_servers) {
        const statusEmoji =
          server.status === 'connected'
            ? colors.success('✓')
            : server.status === 'failed'
              ? colors.error('✗')
              : server.status === 'needs-auth'
                ? colors.warning('⚠')
                : colors.muted('○');
        lines.push(`  ${statusEmoji} ${server.name} ${colors.muted(`(${server.status})`)}`);
      }
    }

    if (message.slash_commands.length > 0) {
      lines.push(`\n${colors.muted('Slash Commands:')} ${message.slash_commands.join(', ')}`);
    }

    if (message.agents && message.agents.length > 0) {
      lines.push(`\n${colors.muted('Agents:')} ${message.agents.join(', ')}`);
    }

    if (message.skills && message.skills.length > 0) {
      lines.push(`\n${colors.muted('Skills:')} ${message.skills.join(', ')}`);
    }

    return lines.join('\n');
  } else if (message.subtype === 'compact_boundary') {
    // Minimal layout
    if (isMinimalLayout()) {
      return `${colors.warning('⚡')} Compacted (${message.compact_metadata.trigger})`;
    }

    const lines: string[] = [];
    lines.push(
      `\n${colors.warning('⚡')} ${colors.bold('Conversation Compacted')} ${colors.muted(`(${message.compact_metadata.trigger})`)}`
    );
    lines.push(
      `   ${colors.muted('Previous tokens:')} ${message.compact_metadata.pre_tokens.toLocaleString()}`
    );
    return lines.join('\n');
  } else if (message.subtype === 'hook_response') {
    // Check if this is one of our known hook types
    if (message.hook_event) {
      try {
        // Create hook data object that matches the expected format
        const hookData: any = {
          ...message, // Include all message properties
          transcript_path: (message as any).transcript_path || '', // Will be populated if available
          cwd: process.cwd(),
          permission_mode: (message as any).permission_mode || undefined,
        };

        return formatHookMessage(message.hook_event, hookData);
      } catch (_error) {
        // Fallback to original formatting if hook formatting fails
        // Silently ignore error for cleaner output
      }
    }

    // Minimal layout fallback
    if (isMinimalLayout()) {
      return `${colors.info('⚙')} Hook: ${message.hook_name || 'Unknown'}`;
    }

    // Fallback to original hook_response formatting
    const lines: string[] = [];
    lines.push(
      `\n${colors.info('⚙')} ${colors.bold('Hook:')} ${message.hook_name || 'Unknown'} ${colors.muted(`(${message.hook_event || 'unknown'})`)}`
    );

    if (message.stdout) {
      lines.push(`\n${colors.muted('stdout:')}`);
      lines.push(
        message.stdout
          .split('\n')
          .map((l) => `  ${l}`)
          .join('\n')
      );
    }

    if (message.stderr) {
      lines.push(`\n${colors.muted('stderr:')}`);
      lines.push(
        colors.error(
          message.stderr
            .split('\n')
            .map((l) => `  ${l}`)
            .join('\n')
        )
      );
    }

    if (message.exit_code !== undefined) {
      const exitIcon = message.exit_code === 0 ? colors.success('✓') : colors.error('✗');
      lines.push(`\n${exitIcon} ${colors.muted('Exit code:')} ${message.exit_code}`);
    }

    return lines.join('\n');
  }

  return colors.muted('[Unknown system message subtype]');
}
