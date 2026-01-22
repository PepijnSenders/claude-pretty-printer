/**
 * Layout mode definitions for claude-pretty-printer
 *
 * Layouts control verbosity and visual density of the output.
 */

/**
 * Available layout modes
 */
export type Layout = 'full' | 'compact' | 'minimal' | 'header';

/**
 * Layout configuration
 */
export interface LayoutConfig {
  name: Layout;
  description: string;
  showBox: boolean; // Whether to wrap content in boxes
  showIcons: boolean; // Whether to show icons/emojis
  showToolParams: boolean; // Whether to show tool parameters
  showStats: boolean; // Whether to show detailed stats
  truncateContent: boolean; // Whether to truncate long content
  maxContentLength: number; // Max chars when truncating (0 = no limit)
}

/**
 * Full layout - Current default with all features
 */
const fullLayout: LayoutConfig = {
  name: 'full',
  description: 'Full output with boxes, icons, and all details',
  showBox: true,
  showIcons: true,
  showToolParams: true,
  showStats: true,
  truncateContent: false,
  maxContentLength: 0,
};

/**
 * Compact layout - No boxes, keep icons and colors
 */
const compactLayout: LayoutConfig = {
  name: 'compact',
  description: 'Condensed output without boxes',
  showBox: false,
  showIcons: true,
  showToolParams: true,
  showStats: true,
  truncateContent: false,
  maxContentLength: 0,
};

/**
 * Minimal layout - Single line per message
 */
const minimalLayout: LayoutConfig = {
  name: 'minimal',
  description: 'Single line per message with truncated content',
  showBox: false,
  showIcons: true,
  showToolParams: false,
  showStats: false,
  truncateContent: true,
  maxContentLength: 80,
};

/**
 * Header layout - Headers only
 */
const headerLayout: LayoutConfig = {
  name: 'header',
  description: 'Headers only, no content',
  showBox: false,
  showIcons: true,
  showToolParams: false,
  showStats: false,
  truncateContent: true,
  maxContentLength: 0, // No content at all
};

/**
 * All available layouts
 */
export const layouts: Record<Layout, LayoutConfig> = {
  full: fullLayout,
  compact: compactLayout,
  minimal: minimalLayout,
  header: headerLayout,
};

/**
 * Layout names for CLI validation
 */
export const LAYOUT_NAMES = Object.keys(layouts) as Layout[];

/**
 * Get a layout by name
 * @param name The layout name
 * @returns The layout config, or full layout if not found
 */
export function getLayout(name: string): LayoutConfig {
  return layouts[name as Layout] || layouts.full;
}
