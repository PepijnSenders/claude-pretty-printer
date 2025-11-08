import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import pc from 'picocolors';
import type { BetaMessageWithThinking, BetaTextBlock, BetaToolUseBlock } from '../types';
import { formatToolParamValue } from '../utils';

export function formatAssistantMessage(
  message: Extract<SDKMessage, { type: 'assistant' }>
): string {
  const lines: string[] = [];
  const msg = message.message as BetaMessageWithThinking;

  // Parse content blocks
  for (const block of msg.content) {
    if (block.type === 'text') {
      const textBlock = block as BetaTextBlock;
      lines.push(textBlock.text);
    } else if (block.type === 'tool_use') {
      const toolUseBlock = block as BetaToolUseBlock;
      lines.push(`\n${pc.cyan('→')} ${pc.bold(toolUseBlock.name)}`);

      // Format input parameters in a compact, readable way
      if (toolUseBlock.input && typeof toolUseBlock.input === 'object') {
        const entries = Object.entries(toolUseBlock.input);
        if (entries.length > 0) {
          for (const [key, value] of entries) {
            // Special handling for TodoWrite's todos parameter
            if (toolUseBlock.name === 'TodoWrite' && key === 'todos' && Array.isArray(value)) {
              lines.push(`  ${pc.dim(key)}:`);
              for (const todo of value) {
                if (typeof todo === 'object' && todo !== null) {
                  const status = todo.status || 'pending';
                  const statusIcon =
                    status === 'completed' ? '✓' : status === 'in_progress' ? '⋯' : '○';
                  const statusColor =
                    status === 'completed'
                      ? pc.green
                      : status === 'in_progress'
                        ? pc.yellow
                        : pc.dim;
                  const content = todo.content || todo.activeForm || '';
                  lines.push(`    ${statusColor(statusIcon)} ${content}`);
                }
              }
            } else {
              const formattedValue = formatToolParamValue(value);
              lines.push(`  ${pc.dim(key)}: ${formattedValue}`);
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
      lines.push(`\n${pc.dim(pc.italic('[Thinking]'))}\n${pc.dim(thinking)}`);
    }
  }

  return lines.join('\n');
}
