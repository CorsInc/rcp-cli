#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { searchCorporations, getCorporationInfo } from './rcp-client.js';

yargs(hideBin(process.argv))
  .scriptName('rcp')
  .usage('$0 <cmd> [args]')
  .command(
    'search <query>',
    'Search corporations by name or registration number',
    (yargs) => {
      yargs.positional('query', {
        type: 'string',
        describe: 'Corporation name or registration number to search',
        demandOption: true,
      });
    },
    async (argv) => {
      try {
        const results = await searchCorporations(argv.query);
        if (results.length === 0) {
          console.log('No results found.');
          return;
        }
        console.log(JSON.stringify(results, null, 2));
      } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
      }
    }
  )
  .command(
    'info <id>',
    'Get detailed information about a corporation by its ID',
    (yargs) => {
      yargs.positional('id', {
        type: 'string',
        describe: 'Corporation ID (e.g., 412345)',
        demandOption: true,
      });
    },
    async (argv) => {
      try {
        const info = await getCorporationInfo(argv.id);
        console.log(JSON.stringify(info, null, 2));
      } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
      }
    }
  )
  .option('json', {
    type: 'boolean',
    default: true,
    describe: 'Output as JSON',
  })
  .demandCommand(1, 'Please specify a command: search or info')
  .strict()
  .help()
  .parse();
