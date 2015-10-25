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

        $app['your.controllers'] = $app->share(function() use ($app) {
            $controllers = new Controllers();
            return $controllers;
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
        if (isset($app['forms.fs'])) {
            $app['forms.fs']->register(__DIR__.'/forms/', '<%= NS %>');
        }
    }

    public function connect(Application $app)
    {
//        $controllers = $app['controllers_factory'];
//
//        $controllers->get( '/',
//            $app['your.controllers']->your_controller_method()
//        )->bind ('route_name');
//
//        return $controllers;
    }
}
