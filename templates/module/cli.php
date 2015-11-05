#!/usr/bin/env php
<?php

/* @var $bootHelper \C\Bootstrap\Common */
/* @var $app \Silex\Application */
$bootHelper = require("bootstrap.php");

// call for default C providers
$bootHelper->setupCli();

// disable a module by its service provider FQ class name, or similar
// $disabled        = $bootHelper->disable('Translator');
// $service         = $disabled[0];
// $serviceRuntime  = $disabled[1];

// register additional cli modules on $app
//$bootHelper->register($service, $runtime);

// register additional cli modules on $console
//$bootHelper->add($command);

// then, boot an app
$app = $bootHelper->boot();

// ...then run the cli instance
$bootHelper->runCli();
