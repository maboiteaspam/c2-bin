# c2-bin

Command and control binary for C projects.

## Install

__Requirements__

- node
- php

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

##### Generate empty package

Generates an empty package 
with appropriate file structure and loader.

```
c2-bin generate
```

##### Initialize a project

Generates project data
required to run the application.

```
c2-bin init
```

##### Run a project

Prepare and starts the project
with all features enabled.

```
c2-bin run
```

##### Link a package

Links a local package
in the current project
vendors directory.

```
c2-bin link -p=..\path\to\package
```

## Development

To develop this project,
clone it locally, then,
link this local copy
 to your global npm binaries.

```
cd /some where/c2-bin/
npm link . --local
```
