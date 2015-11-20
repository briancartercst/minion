var ctrl;
(function (ctrl) {
    ctrl.search = {
        init: function () {
            console.log('ctrl.search init');
        }
    };
})(ctrl || (ctrl = {}));
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/routie.d.ts" />
/// <reference path="./ctrl/search.ts" />
(function () {
    var pageCache = {};
    var view = $('#view');
    $(function () {
        //TODO show waiting animation & block current UI
        routie({
            '': function () {
                routie('search');
            },
            'search': function () {
                showPage('search'); //, (view) => ctrl.search.init(view));
                ctrl.search.init();
            },
            'details/:id': function (id) {
                showPage('details');
            }
        });
    });
    function showPage(page, target) {
        if (target === void 0) { target = view; }
        console.log('Showing ' + page);
        getPage(page, function (pageData) {
            var viewContent = $('<div>' + pageData + '</div>');
            processSubviews(viewContent);
            target.empty().append(viewContent);
        });
    }
    function processSubviews(viewContent) {
        viewContent.find('[fz-subview]').each(function (i, e) {
            var subView = $(e);
            showPage(subView.attr('fz-subview'), subView);
        });
    }
    function getPage(page, cb) {
        if (pageCache[page]) {
            cb(pageCache[page]);
        }
        else {
            $.get('templates/' + page + '.html').done(function (pageData) {
                pageCache[page] = pageData;
                cb(pageData);
            });
        }
    }
})();
//# sourceMappingURL=main.js.map