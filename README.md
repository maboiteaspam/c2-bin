# c2-bin

Command and control binary for C projects.

## Requirements

- node
- php

## Install

Open a terminal and type,
```
npm i c2-bin -g
npm i maboiteaspam/c2-bin -g
```

## Usage

To use `c2-bin`, open a terminal and type in

```
c2-bin --help
c2-bin --version
c2-bin [task name]
c2-bin
```

If `[task name]` is not provided,
`run` is the `default` task to run.

## Tasks

Description of available tasks within this binary.

```
              db-init  Initialize the database and its schema according to your
                       app.
           cache-init  Build assets and other pre compiled stuff.
            http-init  Initialize a bridge file for your http server.
         check-schema  Refresh the DB schema according to your app
        fs-cache-dump  INTERNAL: Dumps all assets path from your app/
                 link  Link another local package to that project. Useful for
                       development under windows.
                watch  Start watching your application assets for re-build.
                start  Starts web server for local development purpose
         get-composer  Generate autoloader for composer
 check-module-install  Check if module is locally installed, and do install
                       when needed.
         classes-dump  Generate autoloader for composer
               update  Run composer update command
              install  Run composer install command
         generate-app  Custom task.
                 open  Open urls and files from a grunt task *
                 init  Alias for "check-module-install", "classes-dump",
                       "cache-init", "http-init", "db-init" tasks.
                  run  Alias for "init", "fs-cache-dump", "open:browser",
                       "watch", "start" tasks.
             generate  Alias for "get-composer", "generate-app" tasks.
              default  Alias for "run" task.
```

## Development

To develop this project,
clone it locally, then,
link this local copy to your global npm binaries.

```
cd /some where/c2-bin/
npm link . --local
```
