define([
        'jquery',
        'jquery/ui',
    ],
    function ($) {
        "use strict";

        let dataHtml = [];
        let urlOptions = document.location.href.split('?p=');
        let loaderConfig = [];

        window.loader = {
            /**
             Initialization.
             Creating button and load html for next page by config data.
             **/
            init: function (config) {
                loaderConfig = config;
                if (!config['buttonStatus']) {
                    return;
                }
                if (window.loader.urlValidate(urlOptions)) {
                    window.loader.loadButtonInit();
                    window.loader.loadProductsHtml();
                }

            },

            /**
             Loading html.
             Get html from next page by link(url) from configuration in template helper.
             **/
            loadProductsHtml: function () {

                $.get(loaderConfig.link, function (data) {
                    let allNodes = $.parseHTML(data);

                    allNodes.forEach(function (element) {
                        if (element.className !== loaderConfig['mainElement']) {
                            return;
                        }
                        dataHtml = element.getElementsByClassName(loaderConfig['loadedElements'])[0];
                       // dataHtml = element.getElementsByClassName(loaderConfig['loadedElements'])[0].children;
                        console.log(dataHtml);
                    });
                });
            },

            /**
             Creating load button.
             Creating button element (and onClick event) by id from configuration in template helper.
             **/
            loadButtonInit: function () {
                $('#additional-load-items').after(
                    '<p><button id="' + loaderConfig['buttonId']+ '">View more</button></p>'
                );
                $('#' + loaderConfig['buttonId']).click(function () {
                    window.loader.loadMore();
                });
            },

            /**
             Loading next page products.
             Adding next page items to div element in template.
             **/
            loadMore: function () {
                if (loaderConfig.currentPage === loaderConfig.lastPage) {
                    $('#' + loaderConfig['buttonId']).hide();
                }
                loaderConfig.currentPage++;
                loaderConfig.link = urlOptions[0] + '?p=' + loaderConfig.currentPage;

                window.loader.loadProductsHtml();
               document.getElementById('additional-load-items').appendChild(dataHtml);
                //element.getElementsByClassName(loaderConfig['loadedElements'])[0].children.appendChild(dataHtml);
            },

            /**
             * Validating url.
             * Checking and incrementing page number.
             *
             * @param urlOptions
             * @returns {boolean}
             */
            urlValidate: function (urlOptions) {
               let pageNumber = urlOptions[1] > 0 ? urlOptions[1] : 1;
                if (pageNumber < loaderConfig.lastPage) {
                    pageNumber++;
                    loaderConfig.currentPage = pageNumber;
                    loaderConfig.link = urlOptions[0] + '?p=' + loaderConfig.currentPage;
                    return true;
                }
                return false;
            }
        };
    });
