<?php
namespace <%= NS %>;

<%
// @todo data providers does not need the whole silex stack, they only need some interface definitions
// @todo this would help to reduce dependencies to their minimum.
%>

use Silex\Application;
use Silex\ServiceProviderInterface;

class ServiceProvider implements ServiceProviderInterface
{
    public function register(Application $app)
    {
        // register service
        // to ...
    }
    public function boot(Application $app)
    {
        // extend service
        // to ...
    }
}