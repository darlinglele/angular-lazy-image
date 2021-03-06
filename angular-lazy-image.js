(function (window, angular) {
    angular.module('ngLazyImage', []).directive('lazyImage', [function () {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return [attrs.width, attrs.height, attrs.original];
                }, function () {
                    lazyLoad();
                }, true);

                function lazyLoad() {
                    element.empty();
                    var thumbnail = $('<img>', {
                        'src': attrs.thumbnail,
                        'class': 'thumbnail',
                        width: attrs.width,
                        height: attrs.height
                    });

                    thumbnail.appendTo(element);

                    if (isScrolledIntoView(element)) {
                        loadOriginalImage()
                    }

                    var timer; //debounce the scroll
                    $(element.parent()).on('scroll', function (e) {
                        if (timer) {
                            clearTimeout(timer);
                        }
                        timer = setTimeout(function () {
                            if (isScrolledIntoView(element)) {
                                loadOriginalImage()
                            }
                        }, 50);
                    });

                    function isScrolledIntoView(elem) {
                        var docViewTop = $(elem).scrollTop();
                        var docViewBottom = docViewTop + $(elem.parent()).height();

                        var elemTop = $(elem).offset().top - $(elem.parent()).offset().top;
                        var elemBottom = elemTop + $(elem).height();
                        return ((elemTop <= docViewBottom) && (elemBottom >= docViewTop));
                    }

                    function loadOriginalImage() {
                        var original = $('<img>', {
                            'src': attrs.original
                        });

                        original.hide();
                        original.appendTo(element);
                        original.on('load', function (event) {
                            thumbnail.attr({src: attrs.original});
                            thumbnail.attr({'class': 'original'});
                        });
                    }
                }
            }
        }
    }])
})(window, window.angular);
