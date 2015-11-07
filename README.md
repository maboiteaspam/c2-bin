# c2-bin

Command and control binary for C projects.

C projects are based on C framework, see more about it here https://github.com/maboiteaspam/Foundation/blob/master/doc/1-Introduction.md

`c2-bin` brings to you several utilities to work on a C project.

You ll start with `generate` command to help you to get a module setup.

Then, use the `run` command, it will start your module and get you ready to develop.

Other commands such `get-composer` or `link` are handy helpers for your daily work.

Finally you can refer to __develop__ section of this __README__ to PR your own changes and improvements about this module.

## Requirements

- node
- php

## Install

Open a terminal and type,
```
npm i maboiteaspam/c2-bin -g

// This will be available after the first release only.
npm i c2-bin -g
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

As it has grown as i was using it, it addresses various concerns.

To help you get a better overview, find a categorized list of the task until further improvements.

###### PHP

Tasks about `php` to run and stop a server, from and within `c2-bin`

```
                start  Starts web server for local development purpose
          start-async  Starts web server for local, and returns asap
           kill-async  Kills the remaining process to let grunt exit properly
```

###### Composer

`composer` helpers to kick start.

Also support package linking on windows with `link` task,

and github repository install with `require-gh`.



```
         get-composer  Get composer.phar
 check-module-install  Check if module is locally installed, and do install
                       when needed.
         classes-dump  Generate autoloader for composer
               update  Run composer update command
              install  Run composer install command
     composer-install  Get composer, then run install
      composer-update  Get composer, then run update
           require-gh  Install a github repository then run composer update.
       add-gh-require  Add a github repository to the composer.json
                 link  Link another local package to that project. Useful for
                       development under windows.
```



###### PhpUnit

`phpunit` helpers to kick start.

```
          get-phpunit  Get phpunit.phar
     register-phpunit  Register phpunit require
```

###### C

`C` helpers to `generate` and `run` modules.

```
              db-init  Initialize the database and its schema according to your
                       app.
           cache-init  Build assets and other pre compiled stuff.
            http-init  Initialize a bridge file for your http server.
         check-schema  Refresh the DB schema according to your app
        fs-cache-dump  Dumps path of resources from the registred modules to feed the watcher process
                watch  Start watching your application assets for re-build.
         generate-app  Generate a C module
         generate-vcl  Generate a Varnish VCL file
                 init  Initialize the module and make it ready t run
                  run  Run the module.
            run-async  Run the module.
             generate  Generate and install a new module
```

###### Misc

```
                 link  Link another local package to that project. Useful for
                       development under windows.
                 open  Open urls and files from a grunt task *
```

## Development

To develop this project,
clone it locally, then,
link this local copy to your global npm binaries.

```
cd /some where/c2-bin/
npm link . --local
```
