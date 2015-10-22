<?php

// This is the runtime configuration values,
// it will override values defined in config.php
$runtime = [
    'debug'                 => true,
    'env'                   => getenv('APP_ENV') ? getenv('APP_ENV') : 'dev',
    'project.path'          => __DIR__,
    'run.path'              => __DIR__.'/run/',
];
// This are tokens re injected in the configuration file
// in the form of %token%
$configTokens = [
    'env',
    'run.path',
    'project.path',
];

// application boot starts now
require 'vendor/autoload.php';
use \C\Bootstrap\Common as BootHelper;

// Boot helper is not mandatory, but for a quick start, it s helpful.
$bootHelper = new BootHelper();

$app = $bootHelper->register($runtime, $configTokens);

<% /* For front end developers, it gives access to a simple controller to develop views. */ %>
<% if (modType && modType.match(/design/)) { %>
$Welcome = new \C\Welcome\ControllersProvider();
$app->register($Welcome);
<% } %>

$thisModule = new \<%= NS %>\ControllersProvider();
$app->register($thisModule);

return $bootHelper;
