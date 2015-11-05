<?php
/* @var $bootHelper \C\Bootstrap\Common */
$bootHelper = require("bootstrap.php");

// boot an app
$app = $bootHelper->boot();

// ...then mount the web modules
<% if (modType && modType.match(/design/)) { %>
$app->mount('/', $Welcome);
<% } %>

// run the web instance
$bootHelper->run();
