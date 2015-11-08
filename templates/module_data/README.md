# <%= NS %>

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<%= NS %> module is about `....`

## Install

Until the module is published,
add this repository to the `composer` file
then run `composer update`.
```
# composer.json
,
    {
      "type": "git",
      "url": "git@github.com:[this user/this repo].git
    }

shell
# composer update
```

or run `c2-bin require-gh -m=...`

```
c2-bin require-gh -m=[this user/this repo]
```


## Registration

To register this module please proceed such,

```php

require 'vendor/autoload.php';


// C registration
$runtime = [
// .. options
];
$configTokens = [
// .. configurable tokens
];

use \C\Bootstrap\Common as BootHelper;
$bootHelper = new BootHelper();

$bootHelper->setup($runtime, $configTokens);

$bootHelper->register(new <%= NS %>\ServiceProvider());


// Silex registration
$app = new Silex\Application();

$app->register(new <%= NS %>\ServiceProvider());

```

## Configuration

This module exposes those configuration values,

##### option.name1

`option.name1` is about `....`, and help to `....`

## Requirements

if any requirement is needed, put it here.

## Contributing

For now on please follow `angular` contributing guide as it s very nice effort.

https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines

Read also about `symfony` recommendations
- http://symfony.com/doc/current/contributing/documentation/format.html
- http://symfony.com/doc/current/contributing/documentation/standards.html

Check also this wonderful software to realize the `git commit` command

- https://github.com/commitizen/cz-cli
- https://github.com/kentcdodds/validate-commit-msg

## Credits, notes, more

Have fun!
