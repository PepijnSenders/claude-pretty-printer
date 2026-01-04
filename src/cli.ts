#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import mri from 'mri';
import pc from 'picocolors';
import { config } from './config';
import { formatMessage } from './index';

/**
 * CLI interface for claude-pretty-printer
 */

const argv = mri(process.argv.slice(2), {
  alias: {
    h: 'help',
    f: 'filter',
  },
  boolean: ['help', 'stats'],
  string: ['filter'],
  default: {
    stats: true,
  },
});

// Parse filter types
const filterTypes: string[] | null = argv.filter
  ? String(argv.filter)
      .split(',')
      .map((t: string) => t.trim())
  : null;

// Set config from CLI flags (--no-stats sets stats=false)
config.noStats = argv.stats === false;

function shouldShowMessage(message: { type: string }): boolean {
  if (!filterTypes) return true;
  return filterTypes.includes(message.type);
}

async function processStdin() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  try {
    for await (const line of rl) {
      if (!line.trim()) continue;

      try {
        const message = JSON.parse(line);
        if (!shouldShowMessage(message)) continue;
        const formatted = formatMessage(message);
        if (formatted.trim()) {
          console.log(formatted);
        }
      } catch (error) {
        console.error(`Error parsing JSON: ${(error as Error).message}`);
        console.error(`Invalid line: ${line}`);
      }
    }
  } catch (error) {
    throw new Error(`Error processing stdin: ${(error as Error).message}`);
  }
}

function processFile(filePath: string) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter((line) => line.trim());

    for (const line of lines) {
      try {
        const message = JSON.parse(line);
        if (!shouldShowMessage(message)) continue;
        const formatted = formatMessage(message);
        if (formatted.trim()) {
          console.log(formatted);
        }
      } catch (error) {
        console.error(`Error parsing JSON: ${(error as Error).message}`);
        console.error(`Invalid line: ${line}`);
      }
    }
  } catch (error) {
    throw new Error(`Error reading file: ${(error as Error).message}`);
  }
}

function processInlineJSON(jsonString: string) {
  try {
    const message = JSON.parse(jsonString);
    if (!shouldShowMessage(message)) return;
    const formatted = formatMessage(message);
    if (formatted.trim()) {
      console.log(formatted);
    }
  } catch (error) {
    throw new Error(`Error parsing JSON: ${(error as Error).message}`);
  }
}

function showHelp() {
  console.log('');
  const box = pc.bold(pc.cyan('┌─────────────────────────────────────────────────────────────┐'));
  const title =
    pc.bold(pc.cyan('│')) +
    pc.bold('                    ') +
    pc.bold(pc.magenta('claude-pretty-printer')) +
    pc.bold('                     ') +
    pc.bold(pc.cyan('│'));
  const line1 = `${pc.bold(pc.cyan('│'))}  ${pc.dim('Transform raw Claude Agent SDK messages into')}        ${pc.bold(pc.cyan('│'))}`;
  const line2 = `${pc.bold(pc.cyan('│'))}  ${pc.dim('beautiful, readable CLI output')}                     ${pc.bold(pc.cyan('│'))}`;
  const bottom = pc.bold(
    pc.cyan('└─────────────────────────────────────────────────────────────┘')
  );

  console.log(box);
  console.log(title);
  console.log(line1);
  console.log(line2);
  console.log(bottom);
  console.log('');

  console.log(pc.bold(pc.green('▶ USAGE EXAMPLES:')));
  console.log('');
  console.log(pc.cyan('  📺  Pipe from Claude CLI'));
  console.log(pc.dim('      claude -p --output-format json "test" | npx claude-pretty-printer'));
  console.log('');
  console.log(pc.cyan('  🎯  Filter specific message types'));
  console.log(
    pc.dim('      claude -p --output-format json "test" | npx claude-pretty-printer -f result')
  );
  console.log(pc.dim('      ... | npx claude-pretty-printer -f result,assistant'));
  console.log('');
  console.log(pc.cyan('  📊  Hide stats'));
  console.log(
    pc.dim('      claude -p --output-format json "test" | npx claude-pretty-printer --no-stats')
  );
  console.log('');
  console.log(pc.cyan('  📁  Read from file'));
  console.log(pc.dim('      npx claude-pretty-printer messages.json'));
  console.log('');
  console.log(pc.cyan('  💬  Inline JSON'));
  console.log(
    pc.dim(
      '      npx claude-pretty-printer \'{"type":"result","subtype":"success","result":"Done"}\''
    )
  );
  console.log('');

  console.log(pc.bold(pc.yellow('▶ INPUT METHODS:')));
  console.log('');
  console.log(pc.dim('  • stdin  ') + pc.white('- Pipe JSON messages line by line'));
  console.log(pc.dim('  • file   ') + pc.white('- Read multi-line JSON from a file'));
  console.log(pc.dim('  • inline ') + pc.white('- Format single JSON argument'));
  console.log('');

  console.log(pc.bold(pc.magenta('▶ MESSAGE TYPES:')));
  console.log('');
  console.log(pc.dim('  Supported: ') + pc.white('assistant, user, result, system, stream_event'));
  console.log('');

  console.log(pc.bold(pc.blue('▶ OPTIONS:')));
  console.log('');
  console.log(pc.dim('  -h, --help       ') + pc.white('Show this help message'));
  console.log(
    pc.dim('  -f, --filter     ') + pc.white('Filter by message type(s), comma-separated')
  );
  console.log(pc.dim('  --no-stats       ') + pc.white('Hide stats summary in results'));
  console.log('');

  console.log(pc.green('✨') + pc.dim(' Happy formatting!'));
  console.log('');
}

async function main() {
  if (argv.help) {
    showHelp();
    process.exit(0);
  }

  const args = argv._;

  try {
    if (args.length === 0) {
      console.log('');
      await processStdin();
    } else if (args.length === 1) {
      const arg = String(args[0]);

      if (arg.startsWith('{')) {
        console.log('');
        processInlineJSON(arg);
      } else {
        console.log('');
        processFile(arg);
      }
    } else {
      throw new Error('Too many arguments. Use --help for usage information.');
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
