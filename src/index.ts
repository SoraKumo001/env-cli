#!/usr/bin/env node

import spawn from 'cross-spawn'
import path from 'path'
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
const argv = require('minimist')(process.argv.slice(2))

function printHelp() {
  console.log([
    'Usage: env-exec [--help] [--debug] [-e <path>] [-p <constiable name>] [-c [environment]] [-- command]',
    '  --help              print help',
    '  --debug             output the files that would be processed but don\'t actually parse them or run the `command`',
    '  -e <path>           parses the file <path> as a `.env` file and adds the constiables to the environment',
    '  -e <path>           multiple -e flags are allowed',
    '  -p <constiable>       print value of <constiable> to the console. If you specify this, you do not have to specify a `command`',
    '  -c [environment]    support cascading env constiables from `.env`, `.env.local`, `.env.<environment>`, `.env.<environment>.local` files',
    '  command             `command` is the actual command you want to run. Best practice is to precede this command with ` -- `. Everything after `--` is considered to be your command. So any flags will not be parsed by this tool but be passed to your command. If you do not do it, this tool will strip those flags'
  ].join('\n'))
}

if (argv.help) {
  printHelp()
  process.exit()
}

let paths = []

if (argv.e) {
  if (typeof argv.e === 'string') {
    paths.push(argv.e)
  } else {
    paths.push(...argv.e)
  }
} else {
  paths.push('.env')
}

if (argv.c) {
  paths = paths.reduce((accumulator, path) => accumulator.concat(
    typeof argv.c === 'string'
      ? [`${path}.${argv.c}.local`, `${path}.${argv.c}`, `${path}.local`, path]
      : [`${path}.local`, path]
  ), [])
}

if (argv.debug) {
  console.log(paths)
  process.exit()
}

paths.forEach(function (env: string) {
  expand(dotenv.config({ path: path.resolve(env) }))
})

if (argv.p) {
  const value = process.env[argv.p]
  console.log(value != null ? value : '')
  process.exit()
}

const command = argv._[0]
if (!command) {
  printHelp()
  process.exit(1)
}

spawn(command, argv._.slice(1), { stdio: 'inherit', shell: true })
  .on('exit', function (exitCode: number) {
    process.exit(exitCode)
  })
