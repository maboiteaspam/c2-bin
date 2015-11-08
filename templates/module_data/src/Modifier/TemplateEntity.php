<?php
namespace <%= NS %>\Modifier;

use \C\Stream\StreamObjectTransform;
use \C\Stream\StreamObject;
//use \C\Stream\StreamDate;
//use \C\Stream\StreamText;

/**
 * Class TemplateEntity
 * provides stream to modify
 * TemplateEntity instances
 *
 * @package <%= NS %>\Modifier
 */
class TemplateEntity{
    /**
     * return a stream which transforms
     * any pushed $templateEntity instance
     * to set its property automatically
     *
     * @param int $range_start
     * @return mixed
     */
    public function transform ($range_start=0) {

//        $dateGenerator = new StreamDate();
//        $textGenerator = new StreamText();
        $object = new StreamObject();

        return StreamObjectTransform::through()
            ->pipe($object->incProp('id', $range_start))
//            ->pipe($dateGenerator->generate('created_at'))
//            ->pipe($dateGenerator->modify('created_at', function ($chunk, $prop) use($dateGenerator){
//                return $dateGenerator->sub($prop, "{$chunk->id} days + 1*{$chunk->id} hours");
//            }))
//            ->pipe($dateGenerator->generate('updated_at'))
//            ->pipe($dateGenerator->modify('updated_at', function ($chunk, $prop) use($dateGenerator){
//                return $dateGenerator->sub($prop, "{$chunk->id} days + 1*{$chunk->id} hours");
//            }))
//            ->pipe($textGenerator->enum('author', $textGenerator->nicknames))
//            ->pipe($textGenerator->enum('status', ['VISIBLE', 'HIDDEN']))
//            ->pipe($textGenerator->words('title', rand(2, 5)))
//            ->pipe($textGenerator->sentences('content', rand(1, 3)))
            ;
    }
}
