# env-exec

## Info

The spawn shell option is added from `dotenv-cli`.

## Usage

```sh
env-exec [--help] [--debug] [-e <path>] [-p <constiable name>] [-c [environment]] [-- command]
  --help              print help
  --debug             output the files that would be processed but don't actually parse them or run the `command`
  -e <path>           parses the file <path> as a `.env` file and adds the constiables to the environment
  -e <path>           multiple -e flags are allowed
  -p <constiable>       print value of <constiable> to the console. If you specify this, you do not have to specify a `command`
  -c [environment]    support cascading env constiables from `.env`, `.env.local`, `.env.<environment>`, `.env.<environment>.local` files
  command             `command` is the actual command you want to run. Best practice is to precede this command with ` -- `. Everything after `--` is considered to be your command. So any flags will not be parsed by this tool but be passed to your command. If you do not do it, this tool will strip those flags 
```
