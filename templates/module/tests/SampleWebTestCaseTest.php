<?php

namespace Silex\Tests;

use C\Welcome\ControllersProvider;
use Silex\Application;
use Silex\WebTestCase;

class SampleWebTestCaseTest extends WebTestCase
{
    public function createApplication()
    {
        /* @var $bootHelper \C\Bootstrap\Common */
        $bootHelper = include __DIR__."/../bootstrap.php";
        $app = $bootHelper->boot();
        /* @var $welcome ControllersProvider */
        $app->mount('/', $welcome);
        return $app;
    }
    public function testGetIndex()
    {
        $client = $this->createClient();
        $client->request('GET', '/');
        $response = $client->getResponse();
        $this->assertTrue($response->isSuccessful());
        $this->assertContains('root', $response->getContent());
    }
    public function testAjaxifiedLayout()
    {
        $client = $this->createClient();
        $client->request('GET', '/hello-the-world-in-ajax.yml');
        $response = $client->getResponse();
        $this->assertTrue($response->isSuccessful());
        $this->assertContains('<div id="e470dcaae4ac74c39ab63d15b0f3f9ce0d748530"></div>', $response->getContent());
        $this->assertContains("$.get('/hello-the-world-in-ajax.yml?target=body_content'", $response->getContent());
        $this->assertNotContains('Hello the world !', $response->getContent());
    }
    public function testAjaxifiedBlock()
    {
        $client = $this->createClient();
        $client->request(
            'GET',
            '/hello-the-world-in-ajax.yml',
            ['target'=>'body_content'],
            [],
            ['HTTP_X-Requested-With' => 'XMLHttpRequest']
        );

        $response = $client->getResponse();
        $this->assertTrue($response->isSuccessful());
        $this->assertContains('Hello the world !', $response->getContent());
        $this->assertNotContains('<html>', $response->getContent());
    }
    public function testAsDesktop()
    {
        $client = $this->createClient();
        // MobileDetect is not mocked so should do like this : /
        $_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0';
        $client->request(
            'GET',
            '/hello-the-world.yml'
        );
        $response = $client->getResponse();
        $this->assertTrue($response->isSuccessful());
        $this->assertContains('Hello the world !', $response->getContent());
        $this->assertNotContains('for mobile devices', $response->getContent());
    }
    public function testAsMobile()
    {
        $client = $this->createClient();
        // MobileDetect is not mocked so should do like this : /
        $_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16';
        $client->request(
            'GET',
            '/hello-the-world.yml',
            [],
            [],
            []
        );

        $response = $client->getResponse();
        $this->assertTrue($response->isSuccessful());
        $this->assertNotContains('Hello the world !', $response->getContent());
        $this->assertNotContains('for mobile devices', $response->getContent());
    }
    public function testAjaxifiedForMobile()
    {
        $client = $this->createClient();
        // MobileDetect is not mocked so should do like this : /
        $_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16';
        $client->request(
            'GET',
            '/hello-the-world.yml',
            ['target'=>'body_content'],
            [],
            [
                'HTTP_X-Requested-With' => 'XMLHttpRequest',
            ]
        );

        $response = $client->getResponse();
        $this->assertTrue($response->isSuccessful());
        $this->assertContains('Hello the world', $response->getContent());
        $this->assertContains('for mobile devices', $response->getContent());
        $this->assertNotContains('<html>', $response->getContent());
    }
}