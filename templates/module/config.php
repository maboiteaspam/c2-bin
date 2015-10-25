<?php
return [
//    'debug' => true,

    'server_type'            => 'builtin',
    'documentRoot'          => '%project.path%/www/',

    'private_build_dir'     => '%project.path%/run/',
    'public_build_dir'      => '%project.path%/www/run/',

    'esi.secret'            => 'secret',
    'form.secret'           => md5(__DIR__.'/run/'),

    'monolog.logfile'       => '%run.path%/development.log',

    'httpcache.check_taged_resource_freshness' => true,

    'caches.options' => [
        'http-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/http/',
        ],
        'assets-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/assets/',
        ],
        'intl-fs-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/intl-fs/',
        ],
        'intl-content-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/intl-content/',
        ],
        'capsule-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/capsule/',
        ],
        'layout-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/layout/',
        ],
        'modern-layout-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/modern-layout/',
        ],
        'forms-fs-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/forms-fs/',
        ],
        'forms-store'=>[
            'driver'    => 'include',
            'cache_dir' => __DIR__ . '/run/forms/',
        ],
    ],
    'assets.concat'     => false,
    'assets.build_dir'  => 'www/run',
    'assets.www_dir'    => '/run',
    'assets.patterns'   => [
        /*
        'pattern_id' => 'pattern_str',
        'blog_list' => '/images/blog/list/:id.jpg',
         */
    ],
    'assets.bridge_file_path' => '%project.path%/run/bridge.php',

//    'capsule.connections' => [
//        "default"=>[
//            'driver'    => 'sqlite',
//            'database'  => '%project.path%/run/database.sqlite',
//            'prefix'    => '',
//            'charset'   => 'utf8',
//            'collation' => 'utf8_unicode_ci',
//        ],
//    ],
];
