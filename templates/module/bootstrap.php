<?php

// override configuration file values here.
$runtime = [
    'debug'                 => true, // this will enable the dashboard
    'env'                   => getenv('APP_ENV') ? getenv('APP_ENV') : 'dev',
    'project.path'          => __DIR__,
    'run.path'              => __DIR__.'/run/',
];

// inject some configuration values as %token% into the configuration
$configTokens = [
    'env',
    'run.path',
    'project.path',
];

// by now, boot
require 'vendor/autoload.php';

// use default C bootstrap, for convenience.
use \C\Bootstrap\Common as BootHelper;

// Boot helper is not mandatory, but for a quick start, it s helpful.
$bootHelper = new BootHelper();

$bootHelper->setup($runtime, $configTokens);

// add additional modules here,
// core or web

// register additional cli modules on $app
//$bootHelper->register($service, $runtime);

<% /* For front end developers, it gives access to a simple controller to develop views. */ %>
<% if (modType && modType.match(/design/)) { %>
$Welcome = new \C\Welcome\ControllersProvider();
$bootHelper->register($Welcome);
<% } %>

$thisModule = new \<%= NS %>\ControllersProvider();
$bootHelper->register($thisModule);

// disable a module by its service provider FQ class name, or similar
// $disabled        = $bootHelper->disable('Translator');
// $service         = $disabled[0];
// $serviceRuntime  = $disabled[1];

return $bootHelper;
