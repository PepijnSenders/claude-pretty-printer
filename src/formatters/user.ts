import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { colors } from '../colors';
import { getFirstLine, isHeaderLayout, isMinimalLayout } from '../utils';

export function formatUserMessage(message: Extract<SDKMessage, { type: 'user' }>): {
  header: string;
  content: string;
} {
  if ('isReplay' in message && message.isReplay) {
    return { header: '', content: '' }; // Skip replay messages to avoid duplication
  }

  const content = message.message.content;
  const lines: string[] = [];
  let hasToolResults = false;

  if (typeof content === 'string') {
    lines.push(content);
  } else if (Array.isArray(content)) {
    for (const block of content) {
      if (typeof block === 'string') {
        lines.push(block);
      } else if (block.type === 'text') {
        lines.push(block.text);
      } else if (block.type === 'image') {
        lines.push(colors.muted('[Image]'));
      } else if (block.type === 'tool_result') {
        hasToolResults = true;
        const resultIcon = block.is_error ? colors.error('✗') : colors.success('✓');
        lines.push(`\n${resultIcon} ${colors.muted(`Tool result: ${block.tool_use_id}`)}`);
        if (typeof block.content === 'string') {
          lines.push(block.content);
        } else if (Array.isArray(block.content)) {
          for (const contentBlock of block.content) {
            if (contentBlock.type === 'text') {
              lines.push(contentBlock.text);
            } else if (contentBlock.type === 'image') {
              lines.push(colors.muted('[Image result]'));
            }
          }
        }
        if (block.is_error) {
          lines.push(colors.error('✗ Error in tool execution'));
        }
      }
    }
  }

  // Choose header based on whether there are tool results
  const header = hasToolResults ? colors.user('◆ USER (Tool Results)') : colors.user('◆ USER');

  // Header-only layout
  if (isHeaderLayout()) {
    return { header, content: '' };
  }

  // Minimal layout: single line summary
  if (isMinimalLayout()) {
    const textContent = lines.join(' ').replace(/\n/g, ' ');
    const minimalContent = getFirstLine(textContent, 80);
    return { header, content: minimalContent };
  }

  const contentText = message.isSynthetic
    ? `${colors.muted('[Synthetic]')} ${lines.join('\n')}`
    : lines.join('\n');

  return { header, content: contentText };
}
