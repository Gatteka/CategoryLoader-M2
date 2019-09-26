<?php

namespace Learn\Category\Helper;

use Magento\Catalog\Block\Product\ProductList\Toolbar;
use Magento\Catalog\Model\Layer\Resolver;
use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Framework\App\Helper\Context;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Catalog\Block\Product\ListProduct;

/**
 * Class Config
 *
 * @package Learn\Category\Helper
 */
class Config extends AbstractHelper
{

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var Context
     */
    private $context;

    /**
     * @var Toolbar
     */
    public $toolbar;

    /**
     * @var ListProduct
     */
    public $listProduct;

    /**
     * @var Json
     */
    public $json;

    /**
     * @var
     */
    public $layerResolver;

    /**
     * Config constructor.
     *
     * @param Context               $context
     * @param StoreManagerInterface $storeManager
     * @param Toolbar               $toolbar
     * @param ListProduct           $listProduct
     * @param Resolver              $layerResolver
     * @param Json                  $json
     */
    public function __construct(
        Context $context,
        StoreManagerInterface $storeManager,
        Toolbar $toolbar,
        ListProduct $listProduct,
        Resolver $layerResolver,
        Json $json
    ) {
        $this->storeManager = $storeManager;
        $this->context = $context;
        $this->toolbar = $toolbar;
        $this->listProduct = $listProduct;
        $this->layerResolver = $layerResolver->get();
        $this->json = $json;
        parent::__construct($context);
    }

    /**
     * Create and serialize config for js loader.
     *
     * @return string
     */
    public function getConfig()
    {
        $pageCharacter = '?p=';
        $url = $this->context->getUrlBuilder()->getCurrentUrl();
        if (!$url) {
            return false;
        }

        $pageNumber = substr(strstr($url, $pageCharacter), 3) ?: '1';
        $lastPage = $this->layerResolver->getProductCollection()->getLastPageNumber();
        $status = $this->layerResolver->getProductCollection()->getLastPageNumber() === $pageNumber ? 0 : 1;

        $config = [
            'link' => $url,
            'buttonStatus' => $status,
            'mainElement' => "page-wrapper",
            'loadedElements' => "products list product-items",
            'buttonId' => 'load-more-button',
            'lastPage' => $lastPage
        ];

        return $this->json->serialize($config);
    }
}
