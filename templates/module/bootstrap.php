<?php

$runtime = [
    'debug'                 => true,
    'env'                   => getenv('APP_ENV') ? getenv('APP_ENV') : 'dev',
    'project.path'          => __DIR__,
    'run.path'              => __DIR__.'/run/',
//    'security.firewalls'    => [],
];
$configTokens = [
    'env',
    'run.path',
    'project.path',
];


require 'vendor/autoload.php';
use \C\Bootstrap\Common as BootHelper;

$bootHelper = new BootHelper();

$app = $bootHelper->register($runtime, $configTokens);

<% if (modType && modType.match(/design/)) { %>
    $thatController = new C\Blog\ControllersProvider();
    $app->register($thatController);
<% } %>

return $bootHelper;
