/**
 * Themed color helper functions for claude-pretty-printer
 *
 * Provides semantic color functions that adapt based on the current theme.
 * Since picocolors only supports basic ANSI colors, themes define which
 * picocolors function to use for each semantic color slot.
 */

import pc from 'picocolors';
import { config } from './config';

/**
 * Color function type matching picocolors signature
 */
type ColorFn = (text: string | number | null | undefined) => string;

/**
 * Theme color mappings to picocolors functions
 * Each theme maps semantic color names to the picocolors function to use
 */
const themeColorMappings: Record<string, Record<string, ColorFn>> = {
  default: {
    primary: pc.cyan,
    secondary: pc.blue,
    accent: pc.magenta,
    success: pc.green,
    error: pc.red,
    warning: pc.yellow,
    assistant: pc.blue,
    user: pc.green,
    result: pc.magenta,
    system: pc.yellow,
    muted: pc.dim,
    info: pc.cyan,
  },
  monokai: {
    primary: pc.magenta,
    secondary: pc.green,
    accent: pc.yellow,
    success: pc.green,
    error: pc.magenta,
    warning: pc.yellow,
    assistant: pc.cyan,
    user: pc.green,
    result: pc.magenta,
    system: pc.yellow,
    muted: pc.dim,
    info: pc.cyan,
  },
  dracula: {
    primary: pc.magenta,
    secondary: pc.cyan,
    accent: pc.magenta,
    success: pc.green,
    error: pc.red,
    warning: pc.yellow,
    assistant: pc.magenta,
    user: pc.green,
    result: pc.magenta,
    system: pc.yellow,
    muted: pc.dim,
    info: pc.cyan,
  },
  nord: {
    primary: pc.cyan,
    secondary: pc.blue,
    accent: pc.magenta,
    success: pc.green,
    error: pc.red,
    warning: pc.yellow,
    assistant: pc.cyan,
    user: pc.green,
    result: pc.magenta,
    system: pc.yellow,
    muted: pc.dim,
    info: pc.blue,
  },
};

/**
 * Get the color function for a semantic color slot
 * @param slot The semantic color slot name
 * @returns The picocolors function to use
 */
function getColorFn(slot: string): ColorFn {
  const themeName = config.theme;
  const mapping = themeColorMappings[themeName] || themeColorMappings.default;
  return mapping[slot] || pc.white;
}

/**
 * Themed color helper object
 * Use these functions instead of direct picocolors calls for theme support
 */
export const colors = {
  // Primary colors
  primary: (text: string) => getColorFn('primary')(text),
  secondary: (text: string) => getColorFn('secondary')(text),
  accent: (text: string) => getColorFn('accent')(text),

  // Semantic colors
  success: (text: string) => getColorFn('success')(text),
  error: (text: string) => getColorFn('error')(text),
  warning: (text: string) => getColorFn('warning')(text),

  // Message type colors
  assistant: (text: string) => getColorFn('assistant')(text),
  user: (text: string) => getColorFn('user')(text),
  result: (text: string) => getColorFn('result')(text),
  system: (text: string) => getColorFn('system')(text),

  // Utility colors
  muted: (text: string) => getColorFn('muted')(text),
  info: (text: string) => getColorFn('info')(text),

  // Pass-through for formatting functions (not themed)
  bold: pc.bold,
  dim: pc.dim,
  italic: pc.italic,
  gray: pc.gray,
  white: pc.white,
};

/**
 * Get raw picocolors for cases where direct color access is needed
 * (e.g., help text that shouldn't change with themes)
 */
export { pc };
