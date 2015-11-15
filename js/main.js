/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/routie.d.ts" />
(function () {
    $(function () {
        //TODO show waiting animation & block current UI
        routie({
            '': function () {
                routie('search');
            },
            'search': function () {
                showPage('search');
            },
            'details/:id': function (id) {
                showPage('details');
            }
        });
    });
    var pageCache = {};
    var view = $('#view');
    function showPage(page) {
        console.log('Showing ' + page);
        getPage(page, function (pageData) {
            view.empty().append($('<div>' + pageData + '</div>'));
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