import { colors } from '../colors';
import { isHeaderLayout, isMinimalLayout } from '../utils';

/**
 * Formats PreToolUse hook callback messages
 */
function formatPreToolUseHook(message: any): string {
  // Header-only layout handled by system.ts
  if (isHeaderLayout()) {
    return '';
  }

  // Minimal layout
  if (isMinimalLayout()) {
    return `${colors.secondary('🔧')} Pre-Tool: ${colors.primary(message.tool_name)}`;
  }

  const lines: string[] = [];
  lines.push(
    `\n${colors.secondary('🔧')} ${colors.bold('Pre-Tool Use:')} ${colors.primary(message.tool_name)}`
  );

  if (message.cwd) {
    lines.push(`   ${colors.muted('Working directory:')} ${message.cwd}`);
  }

  if (message.tool_input) {
    lines.push(`\n${colors.muted('Tool input:')}`);
    const inputStr =
      typeof message.tool_input === 'string'
        ? message.tool_input
        : JSON.stringify(message.tool_input, null, 2);
    lines.push(
      inputStr
        .split('\n')
        .map((l: string) => `  ${colors.gray(l)}`)
        .join('\n')
    );
  }

  return lines.join('\n');
}

/**
 * Formats PostToolUse hook callback messages
 */
function formatPostToolUseHook(message: any): string {
  if (isHeaderLayout()) {
    return '';
  }

  if (isMinimalLayout()) {
    return `${colors.success('✅')} Post-Tool: ${colors.primary(message.tool_name)}`;
  }

  const lines: string[] = [];
  lines.push(
    `\n${colors.success('✅')} ${colors.bold('Post-Tool Use:')} ${colors.primary(message.tool_name)}`
  );

  if (message.cwd) {
    lines.push(`   ${colors.muted('Working directory:')} ${message.cwd}`);
  }

  if (message.tool_response !== undefined) {
    lines.push(`\n${colors.muted('Tool response:')}`);
    const responseStr =
      typeof message.tool_response === 'string'
        ? message.tool_response
        : JSON.stringify(message.tool_response, null, 2);

    // Limit response length for readability
    const maxLength = 500;
    const truncatedResponse =
      responseStr.length > maxLength
        ? responseStr.substring(0, maxLength) + colors.muted('... (truncated)')
        : responseStr;

    lines.push(
      truncatedResponse
        .split('\n')
        .map((l: string) => `  ${colors.gray(l)}`)
        .join('\n')
    );
  }

  return lines.join('\n');
}

/**
 * Formats Notification hook callback messages
 */
function formatNotificationHook(message: any): string {
  if (isHeaderLayout()) {
    return '';
  }

  if (isMinimalLayout()) {
    return `${colors.warning('🔔')} ${message.title || 'Notification'}`;
  }

  const lines: string[] = [];
  lines.push(`\n${colors.warning('🔔')} ${colors.bold('Notification')}`);

  if (message.title) {
    lines.push(`   ${colors.primary(message.title)}`);
  }

  if (message.message) {
    lines.push(`\n${colors.muted('Message:')}`);
    lines.push(
      message.message
        .split('\n')
        .map((l: string) => `  ${l}`)
        .join('\n')
    );
  }

  if (message.cwd) {
    lines.push(`\n   ${colors.muted('Location:')} ${message.cwd}`);
  }

  return lines.join('\n');
}

/**
 * Formats UserPromptSubmit hook callback messages
 */
function formatUserPromptSubmitHook(message: any): string {
  if (isHeaderLayout()) {
    return '';
  }

  if (isMinimalLayout()) {
    const preview = message.prompt?.substring(0, 40) || '';
    return `${colors.accent('📝')} Prompt: ${preview}${message.prompt?.length > 40 ? '...' : ''}`;
  }

  const lines: string[] = [];
  lines.push(`\n${colors.accent('📝')} ${colors.bold('User Prompt Submitted')}`);

  if (message.cwd) {
    lines.push(`   ${colors.muted('Working directory:')} ${message.cwd}`);
  }

  if (message.prompt) {
    lines.push(`\n${colors.muted('Prompt:')}`);
    // Show first 200 characters of prompt to avoid overwhelming output
    const preview =
      message.prompt.length > 200
        ? message.prompt.substring(0, 200) + colors.muted('... (truncated)')
        : message.prompt;

    lines.push(
      preview
        .split('\n')
        .map((l: string) => `  ${l}`)
        .join('\n')
    );
  }

  return lines.join('\n');
}

/**
 * Formats SessionStart hook callback messages
 */
function formatSessionStartHook(message: any): string {
  if (isHeaderLayout()) {
    return '';
  }

  const sourceIcons: Record<string, string> = {
    startup: colors.success('🚀'),
    resume: colors.secondary('▶️'),
    clear: colors.warning('🔄'),
    compact: colors.info('📦'),
  };

  const icon = sourceIcons[message.source] || colors.muted('📍');

  if (isMinimalLayout()) {
    return `${icon} Session started (${message.source})`;
  }

  const lines: string[] = [];
  lines.push(`\n${icon} ${colors.bold('Session Started')} ${colors.muted(`(${message.source})`)}`);

  if (message.transcript_path) {
    lines.push(`   ${colors.muted('Transcript:')} ${message.transcript_path}`);
  }

  if (message.cwd) {
    lines.push(`   ${colors.muted('Working directory:')} ${message.cwd}`);
  }

  if (message.permission_mode) {
    lines.push(`   ${colors.muted('Permission mode:')} ${message.permission_mode}`);
  }

  return lines.join('\n');
}

/**
 * Formats SessionEnd hook callback messages
 */
function formatSessionEndHook(message: any): string {
  if (isHeaderLayout()) {
    return '';
  }

  if (isMinimalLayout()) {
    return `${colors.error('🛑')} Session ended${message.reason ? ` (${message.reason})` : ''}`;
  }

  const lines: string[] = [];
  lines.push(`\n${colors.error('🛑')} ${colors.bold('Session Ended')}`);

  if (message.reason) {
    lines.push(`   ${colors.muted('Reason:')} ${colors.warning(message.reason)}`);
  }

  if (message.transcript_path) {
    lines.push(`   ${colors.muted('Transcript:')} ${message.transcript_path}`);
  }

  if (message.cwd) {
    lines.push(`   ${colors.muted('Working directory:')} ${message.cwd}`);
  }

  return lines.join('\n');
}

/**
 * Formats Stop hook callback messages
 */
function formatStopHook(message: any): string {
  if (isHeaderLayout()) {
    return '';
  }

  const stopIcon = message.stop_hook_active ? colors.warning('⏸️') : colors.error('🛑');

  if (isMinimalLayout()) {
    return `${stopIcon} Stop hook ${message.stop_hook_active ? 'active' : 'inactive'}`;
  }

  const lines: string[] = [];
  lines.push(`\n${stopIcon} ${colors.bold('Stop Hook Triggered')}`);

  if (message.stop_hook_active) {
    lines.push(`   ${colors.warning('Stop hook is active')}`);
  } else {
    lines.push(`   ${colors.muted('Stop hook is inactive')}`);
  }

  if (message.cwd) {
    lines.push(`   ${colors.muted('Working directory:')} ${message.cwd}`);
  }

  if (message.transcript_path) {
    lines.push(`   ${colors.muted('Transcript:')} ${message.transcript_path}`);
  }

  return lines.join('\n');
}

/**
 * Formats SubagentStop hook callback messages
 */
function formatSubagentStopHook(message: any): string {
  if (isHeaderLayout()) {
    return '';
  }

  const stopIcon = message.stop_hook_active ? colors.warning('⏸️') : colors.error('🛑');

  if (isMinimalLayout()) {
    return `${stopIcon} Subagent stop ${message.stop_hook_active ? 'active' : 'inactive'}`;
  }

  const lines: string[] = [];
  lines.push(`\n${stopIcon} ${colors.bold('Subagent Stop Hook Triggered')}`);

  if (message.stop_hook_active) {
    lines.push(`   ${colors.warning('Stop hook is active')}`);
  } else {
    lines.push(`   ${colors.muted('Stop hook is inactive')}`);
  }

  if (message.cwd) {
    lines.push(`   ${colors.muted('Working directory:')} ${message.cwd}`);
  }

  if (message.transcript_path) {
    lines.push(`   ${colors.muted('Transcript:')} ${message.transcript_path}`);
  }

  return lines.join('\n');
}

/**
 * Formats PreCompact hook callback messages
 */
function formatPreCompactHook(message: any): string {
  if (isHeaderLayout()) {
    return '';
  }

  const triggerIcons: Record<string, string> = {
    manual: colors.secondary('👆'),
    auto: colors.info('🤖'),
  };

  const icon = triggerIcons[message.trigger] || colors.muted('📦');

  if (isMinimalLayout()) {
    return `${icon} Pre-compaction (${message.trigger})`;
  }

  const lines: string[] = [];
  lines.push(`\n${icon} ${colors.bold('Pre-Compaction')} ${colors.muted(`(${message.trigger})`)}`);

  if (message.custom_instructions) {
    lines.push(`\n${colors.muted('Custom instructions:')}`);
    lines.push(
      message.custom_instructions
        .split('\n')
        .map((l: string) => `  ${colors.primary(l)}`)
        .join('\n')
    );
  } else {
    lines.push(`   ${colors.muted('No custom instructions')}`);
  }

  if (message.transcript_path) {
    lines.push(`\n   ${colors.muted('Transcript:')} ${message.transcript_path}`);
  }

  if (message.cwd) {
    lines.push(`   ${colors.muted('Working directory:')} ${message.cwd}`);
  }

  return lines.join('\n');
}

/**
 * Main hook message formatter that routes to specific formatters
 */
export function formatHookMessage(hookEventName: string, hookData: any): string {
  switch (hookEventName) {
    case 'PreToolUse':
      return formatPreToolUseHook(hookData);
    case 'PostToolUse':
      return formatPostToolUseHook(hookData);
    case 'Notification':
      return formatNotificationHook(hookData);
    case 'UserPromptSubmit':
      return formatUserPromptSubmitHook(hookData);
    case 'SessionStart':
      return formatSessionStartHook(hookData);
    case 'SessionEnd':
      return formatSessionEndHook(hookData);
    case 'Stop':
      return formatStopHook(hookData);
    case 'SubagentStop':
      return formatSubagentStopHook(hookData);
    case 'PreCompact':
      return formatPreCompactHook(hookData);
    default:
      // Throw an error to trigger fallback to original formatting
      throw new Error(`Unknown hook type: ${hookEventName}`);
  }
}
