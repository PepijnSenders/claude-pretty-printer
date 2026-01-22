/**
 * Theme definitions for claude-pretty-printer
 *
 * Each theme defines semantic color slots that are used consistently
 * throughout the formatter for different types of content.
 */

/**
 * Theme interface with semantic color slots
 */
export interface Theme {
  name: string;
  description: string;
  colors: {
    // Primary colors for main content
    primary: string; // Tool names, emphasis, main highlights
    secondary: string; // Secondary highlights, cache info
    accent: string; // Accents, special highlights

    // Semantic colors
    success: string; // Success icons, completed states
    error: string; // Error icons, failures
    warning: string; // Warnings, cost displays

    // Message type colors
    assistant: string; // Assistant message headers
    user: string; // User message headers
    result: string; // Result message headers
    system: string; // System message headers

    // Utility colors
    muted: string; // Dim/secondary text
    info: string; // Informational content
  };
}

/**
 * Default theme - Current vibrant scheme
 */
const defaultTheme: Theme = {
  name: 'default',
  description: 'Vibrant colors for maximum readability',
  colors: {
    primary: '#3B82F6', // blue
    secondary: '#06B6D4', // cyan
    accent: '#D946EF', // magenta/fuchsia
    success: '#22C55E', // green
    error: '#EF4444', // red
    warning: '#EAB308', // yellow
    assistant: '#3B82F6', // blue
    user: '#22C55E', // green
    result: '#D946EF', // magenta
    system: '#EAB308', // yellow
    muted: '#6B7280', // gray
    info: '#06B6D4', // cyan
  },
};

/**
 * Monokai theme - Warm dark theme inspired by the classic editor theme
 */
const monokaiTheme: Theme = {
  name: 'monokai',
  description: 'Warm dark theme with classic Monokai colors',
  colors: {
    primary: '#F92672', // pink
    secondary: '#A6E22E', // green
    accent: '#FD971F', // orange
    success: '#A6E22E', // green
    error: '#F92672', // pink
    warning: '#E6DB74', // yellow
    assistant: '#66D9EF', // cyan
    user: '#A6E22E', // green
    result: '#AE81FF', // purple
    system: '#FD971F', // orange
    muted: '#75715E', // comment gray
    info: '#66D9EF', // cyan
  },
};

/**
 * Dracula theme - Purple-centric dark theme
 */
const draculaTheme: Theme = {
  name: 'dracula',
  description: 'Purple-centric theme with Dracula palette',
  colors: {
    primary: '#BD93F9', // purple
    secondary: '#8BE9FD', // cyan
    accent: '#FF79C6', // pink
    success: '#50FA7B', // green
    error: '#FF5555', // red
    warning: '#F1FA8C', // yellow
    assistant: '#BD93F9', // purple
    user: '#50FA7B', // green
    result: '#FF79C6', // pink
    system: '#FFB86C', // orange
    muted: '#6272A4', // comment
    info: '#8BE9FD', // cyan
  },
};

/**
 * Nord theme - Arctic, calm colors
 */
const nordTheme: Theme = {
  name: 'nord',
  description: 'Arctic calm theme with muted colors',
  colors: {
    primary: '#88C0D0', // frost blue
    secondary: '#81A1C1', // blue
    accent: '#B48EAD', // purple
    success: '#A3BE8C', // green
    error: '#BF616A', // red
    warning: '#EBCB8B', // yellow
    assistant: '#88C0D0', // frost blue
    user: '#A3BE8C', // green
    result: '#B48EAD', // purple
    system: '#EBCB8B', // yellow
    muted: '#4C566A', // polar night
    info: '#81A1C1', // blue
  },
};

/**
 * All available themes
 */
export const themes: Record<string, Theme> = {
  default: defaultTheme,
  monokai: monokaiTheme,
  dracula: draculaTheme,
  nord: nordTheme,
};

/**
 * Theme names for CLI validation
 */
export const THEME_NAMES = Object.keys(themes) as string[];

/**
 * Get a theme by name
 * @param name The theme name
 * @returns The theme object, or default theme if not found
 */
export function getTheme(name: string): Theme {
  return themes[name] || themes.default;
}
