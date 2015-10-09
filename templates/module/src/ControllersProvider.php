<?php
namespace <%= NS %>;

use Silex\Application;
use Silex\ServiceProviderInterface;
use Silex\ControllerProviderInterface;

class ControllersProvider implements
    ServiceProviderInterface,
    ControllerProviderInterface
{
    /**
     * Register services.
     *
     * @param Application $app
     **/
    public function register(Application $app)
    {
        /*
        $app['service.name'] = $app->share(function() use ($app) {
            return new \stdClass();
        });
        $app['service.name'] = $app->extend("service.name", function($value, $app) use ($app) {
            $value[] = "some";
            return $value;
        });
         */
    }

    /**
     * Boot and configure services.
     *
     * @param Application $app Silex application instance.
     * @return void
     **/
    public function boot(Application $app)
    {
        if (isset($app['assets.fs'])) {
            $app['assets.fs']->register(__DIR__.'/assets/', '<%= NS %>');
        }
        if (isset($app['layout.fs'])) {
            $app['layout.fs']->register(__DIR__.'/templates/', '<%= NS %>');
        }
        if (isset($app['intl.fs'])) {
            $app['intl.fs']->register(__DIR__.'/intl/', '<%= NS %>');
        }
        if (isset($app['modern.fs'])) {
            $app['modern.fs']->register(__DIR__.'/layouts/', '<%= NS %>');
        }
    }

    public function connect(Application $app)
    {
//        $controllers = $app['controllers_factory'];
//
//        $controllers->get( '/',
//            $app['your.service.controller']->your_controller_method()
//        )->bind ('route_name');
//
//        return $controllers;
    }
}