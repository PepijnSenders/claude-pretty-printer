import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { colors } from '../colors';
import type { BetaMessageWithThinking, BetaTextBlock, BetaToolUseBlock } from '../types';
import {
  formatToolParamValue,
  getFirstLine,
  isHeaderLayout,
  isMinimalLayout,
  shouldShowToolParams,
} from '../utils';

export function formatAssistantMessage(
  message: Extract<SDKMessage, { type: 'assistant' }>
): string {
  const msg = message.message as BetaMessageWithThinking;

  // Header-only layout: return empty string (header shown by index.ts)
  if (isHeaderLayout()) {
    return '';
  }

  // Minimal layout: single line summary
  if (isMinimalLayout()) {
    const textContent = msg.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as BetaTextBlock).text)
      .join(' ');
    const toolCount = msg.content.filter((block) => block.type === 'tool_use').length;

    if (textContent) {
      return getFirstLine(textContent, 80);
    } else if (toolCount > 0) {
      const toolNames = msg.content
        .filter((block) => block.type === 'tool_use')
        .map((block) => (block as BetaToolUseBlock).name)
        .join(', ');
      return `${colors.primary('→')} ${toolNames}`;
    }
    return '';
  }

  // Full/compact layout
  const lines: string[] = [];

  // Parse content blocks
  for (const block of msg.content) {
    if (block.type === 'text') {
      const textBlock = block as BetaTextBlock;
      lines.push(textBlock.text);
    } else if (block.type === 'tool_use') {
      const toolUseBlock = block as BetaToolUseBlock;
      lines.push(`\n${colors.primary('→')} ${colors.bold(toolUseBlock.name)}`);

      // Format input parameters in a compact, readable way (if layout allows)
      if (shouldShowToolParams() && toolUseBlock.input && typeof toolUseBlock.input === 'object') {
        const entries = Object.entries(toolUseBlock.input);
        if (entries.length > 0) {
          for (const [key, value] of entries) {
            // Special handling for TodoWrite's todos parameter
            if (toolUseBlock.name === 'TodoWrite' && key === 'todos' && Array.isArray(value)) {
              lines.push(`  ${colors.muted(key)}:`);
              for (const todo of value) {
                if (typeof todo === 'object' && todo !== null) {
                  const status = todo.status || 'pending';
                  const statusIcon =
                    status === 'completed' ? '✓' : status === 'in_progress' ? '⋯' : '○';
                  const statusColor =
                    status === 'completed'
                      ? colors.success
                      : status === 'in_progress'
                        ? colors.warning
                        : colors.muted;
                  const content = todo.content || todo.activeForm || '';
                  lines.push(`    ${statusColor(statusIcon)} ${content}`);
                }
              }
            } else {
              const formattedValue = formatToolParamValue(value);
              lines.push(`  ${colors.muted(key)}: ${formattedValue}`);
            }
          }
        }
      }
    }
  }

  // Add thinking content if present
  if (msg.thinking && Array.isArray(msg.thinking)) {
    const thinking = msg.thinking
      .filter((t) => t.type === 'text')
      .map((t) => t.text)
      .join('\n');
    if (thinking) {
      lines.push(`\n${colors.muted(colors.italic('[Thinking]'))}\n${colors.muted(thinking)}`);
    }
  }

  return lines.join('\n');
}
