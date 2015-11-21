/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/routie.d.ts" />
// Define controller module with dummy export, to allow dynamic module loading
var ctrl;
(function (ctrl) {
    ctrl.dummy = null;
})(ctrl || (ctrl = {}));
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
                templater.showPage('search');
            },
            'details/:id': function (id) {
                templater.showPage('details');
            }
        });
    });
    //TODO move to separate module
    var Templater = (function () {
        function Templater() {
        }
        Templater.prototype.showPage = function (page, target) {
            var _this = this;
            if (target === void 0) { target = view; }
            console.log('Showing ' + page);
            this.getPage(page, function (pageData) {
                var viewContent = $('<div>' + pageData + '</div>');
                _this.processSubviews(viewContent);
                target.empty().append(viewContent);
                _this.initController(page);
            });
        };
        Templater.prototype.processSubviews = function (viewContent) {
            var _this = this;
            viewContent.find('[fz-subview]').each(function (i, e) {
                var subView = $(e);
                _this.showPage(subView.attr('fz-subview'), subView);
            });
        };
        Templater.prototype.getPage = function (page, cb) {
            if (pageCache[page]) {
                cb(pageCache[page]);
            }
            else {
                $.get('templates/' + page + '.html').done(function (pageData) {
                    pageCache[page] = pageData;
                    cb(pageData);
                });
            }
        };
        Templater.prototype.initController = function (page) {
            var ctrlName = this.dashed2camel(page);
            if (!ctrl[ctrlName])
                return;
            ctrl[ctrlName].init();
        };
        Templater.prototype.dashed2camel = function (str) {
            return str; //TODO implement
        };
        return Templater;
    })();
    var templater = new Templater();
})();
var ctrl;
(function (ctrl) {
    ctrl.search = {
        data: {},
        init: function () {
            console.log('ctrl.search init');
        },
        done: function () {
            console.log('ctrl.search done');
        }
    };
})(ctrl || (ctrl = {}));
//# sourceMappingURL=main.js.map