<?php

use \C\Fixture\Generator;
use \C\Stream\StreamObject;

use <%= NS %>\Entity\TemplateEntity;

use <%= NS %>\Modifier\TemplateEntity as TemplateEntityModifier;

$object     = new StreamObject();
$modifier   = new TemplateEntityModifier();

/**
 * generate a hundred templateEntities
 * using default TemplateEntity modifier
 */
return Generator::generate( new TemplateEntity(), $modifier->transform(), 100);