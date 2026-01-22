import { colors } from './colors';
import { config } from './config';
import { getLayout } from './layouts';

/**
 * Get terminal width, defaulting to 80 if not available
 */
export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

/**
 * Creates a horizontal line of the specified character
 */
export function createLine(char: string, width?: number): string {
  const termWidth = width ?? getTerminalWidth();
  return char.repeat(termWidth);
}

/**
 * Wraps content in a box with header (layout-aware)
 * For non-full layouts, returns just header + content without box
 */
export function createBox(header: string, content: string): string {
  const layout = getLayout(config.layout);

  // For non-full layouts, skip the box
  if (!layout.showBox) {
    if (content.trim()) {
      return `${header}\n${content}`;
    }
    return header;
  }

  // Full layout: wrap in box
  const termWidth = getTerminalWidth();
  const topLine = createLine('─', termWidth);
  const bottomLine = createLine('─', termWidth);

  return `${colors.muted(topLine)}\n${header}\n${content}\n${colors.muted(bottomLine)}`;
}

/**
 * Truncates text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (maxLength <= 0 || text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Gets the first line of text, truncated if needed
 */
export function getFirstLine(text: string, maxLength = 80): string {
  const firstLine = text.split('\n')[0] || '';
  return truncateText(firstLine.trim(), maxLength);
}

/**
 * Check if current layout should show tool parameters
 */
export function shouldShowToolParams(): boolean {
  const layout = getLayout(config.layout);
  return layout.showToolParams;
}

/**
 * Check if current layout should show stats
 */
export function shouldShowStats(): boolean {
  const layout = getLayout(config.layout);
  return layout.showStats && !config.noStats;
}

/**
 * Check if current layout should truncate content
 */
export function shouldTruncateContent(): boolean {
  const layout = getLayout(config.layout);
  return layout.truncateContent;
}

/**
 * Get max content length for current layout
 */
export function getMaxContentLength(): number {
  const layout = getLayout(config.layout);
  return layout.maxContentLength;
}

/**
 * Check if current layout is minimal (single line)
 */
export function isMinimalLayout(): boolean {
  return config.layout === 'minimal';
}

/**
 * Check if current layout is header-only
 */
export function isHeaderLayout(): boolean {
  return config.layout === 'header';
}

/**
 * Formats a tool parameter value in a compact, readable way
 */
export function formatToolParamValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') {
    // Truncate very long strings
    if (value.length > 100) {
      return `"${value.slice(0, 97)}..."`;
    }
    return `"${value}"`;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.length <= 3) {
      return `[${value.map((v) => formatToolParamValue(v)).join(', ')}]`;
    }
    return `[${value
      .slice(0, 3)
      .map((v) => formatToolParamValue(v))
      .join(', ')}, ... +${value.length - 3} more]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    if (entries.length === 1) {
      const [k, v] = entries[0];
      return `{ ${k}: ${formatToolParamValue(v)} }`;
    }
    // For complex objects, show in compact JSON
    const json = JSON.stringify(value);
    if (json.length <= 80) return json;
    return `{ ${entries.length} properties }`;
  }
  return String(value);
}
