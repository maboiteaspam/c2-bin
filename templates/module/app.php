<?php
$bootHelper = require("bootstrap.php");
$app = $bootHelper->app;
<% if (modType && modType.match(/design/)) { %>
$app->mount('/', $Welcome);
<% } %>
$app->run();
