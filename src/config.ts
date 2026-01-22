import type { Layout } from './layouts';

/**
 * Shared configuration state for CLI flags
 */
export const config: {
  noStats: boolean;
  theme: string;
  layout: Layout;
} = {
  noStats: false,
  theme: 'default',
  layout: 'full',
};
