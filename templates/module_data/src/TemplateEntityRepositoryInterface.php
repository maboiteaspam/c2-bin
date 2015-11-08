<?php
namespace <%= NS %>;

/**
 * Interface TemplateEntityRepositoryInterface
 *
 * @package <%= NS %>
 */
interface TemplateEntityRepositoryInterface{

    /**
     * Returns most recent
     * last update date
     * against all TemplateEntity
     *
     * @return string
     */
    public function lastUpdateDate();
}
