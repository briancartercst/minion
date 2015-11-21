(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/routie.d.ts" />
// Define controller module with dummy export, to allow dynamic module loading
//module ctrl { export var dummy = null; }
var templater_1 = require('./templater');
(function () {
    var view = $('#view');
    $(function () {
        //TODO show waiting animation & block current UI
        routie({
            '': function () {
                routie('search');
            },
            'search': function () {
                templater_1["default"].showPage('search', view);
            },
            'details/:id': function (id) {
                templater_1["default"].showPage('details', view);
            }
        });
    });
})();

},{"./templater":3}],3:[function(require,module,exports){
var pageCache = {};
var Templater = (function () {
    function Templater() {
    }
    Templater.prototype.showPage = function (page, target) {
        var _this = this;
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
            return; //TODO dynamically load controller
        ctrl[ctrlName].init();
    };
    Templater.prototype.dashed2camel = function (str) {
        var parts = str.split('-');
        var camel = parts[0];
        for (var i = 1; i < parts.length; i++) {
            camel += this.ucfirst(parts[i]);
        }
        return camel;
    };
    Templater.prototype.ucfirst = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return Templater;
})();
exports.__esModule = true;
exports["default"] = new Templater();

},{}]},{},[2,1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9jdHJsL3NlYXJjaC50cyIsInRzL21haW4udHMiLCJ0cy90ZW1wbGF0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFPLElBQUksQ0FjVjtBQWRELFdBQU8sSUFBSSxFQUFDLENBQUM7SUFFQyxXQUFNLEdBQUc7UUFDckIsSUFBSSxFQUFFLEVBQUU7UUFFUixJQUFJO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFFRCxJQUFJO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7S0FDRCxDQUFDO0FBRUgsQ0FBQyxFQWRNLElBQUksS0FBSixJQUFJLFFBY1Y7OztBQ2RELDJDQUEyQztBQUMzQywyQ0FBMkM7QUFFM0MsOEVBQThFO0FBQzlFLDBDQUEwQztBQUMxQywwQkFBc0IsYUFBYSxDQUFDLENBQUE7QUFFcEMsQ0FBQztJQUVELElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV4QixDQUFDLENBQUM7UUFDRCxnREFBZ0Q7UUFDaEQsTUFBTSxDQUFDO1lBQ04sRUFBRSxFQUFFO2dCQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQixDQUFDO1lBQ0QsUUFBUSxFQUFFO2dCQUNULHNCQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsYUFBYSxFQUFFLFVBQUMsRUFBRTtnQkFDakIsc0JBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3JDLENBQUM7U0FDRCxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUVILENBQUMsQ0FBQyxFQUFFLENBQUM7OztBQzFCTCxJQUFNLFNB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LENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlIGN0cmwge1xuXG5cdGV4cG9ydCBjb25zdCBzZWFyY2ggPSB7XG5cdFx0ZGF0YToge30sXG5cblx0XHRpbml0KCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ2N0cmwuc2VhcmNoIGluaXQnKTtcblx0XHR9LFxuXG5cdFx0ZG9uZSgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdjdHJsLnNlYXJjaCBkb25lJyk7XG5cdFx0fVxuXHR9O1xuXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3RzZC9qcXVlcnkuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHNkL3JvdXRpZS5kLnRzXCIgLz5cblxuLy8gRGVmaW5lIGNvbnRyb2xsZXIgbW9kdWxlIHdpdGggZHVtbXkgZXhwb3J0LCB0byBhbGxvdyBkeW5hbWljIG1vZHVsZSBsb2FkaW5nXG4vL21vZHVsZSBjdHJsIHsgZXhwb3J0IHZhciBkdW1teSA9IG51bGw7IH1cbmltcG9ydCB0ZW1wbGF0ZXIgZnJvbSAnLi90ZW1wbGF0ZXInO1xuXG4oZnVuY3Rpb24oKSB7XHQvL1RPRE8gcmVwbGFjZSB0aGlzIElJRiB3aXRoIGJ1aWxkIHN0ZXAsIHRvIGVuY2Fwc3VsYXRlIG1vZHVsZXMgdG9vXG5cbmNvbnN0IHZpZXcgPSAkKCcjdmlldycpO1xuXG4kKCgpID0+IHtcblx0Ly9UT0RPIHNob3cgd2FpdGluZyBhbmltYXRpb24gJiBibG9jayBjdXJyZW50IFVJXG5cdHJvdXRpZSh7XG5cdFx0Jyc6ICgpID0+IHtcblx0XHRcdHJvdXRpZSgnc2VhcmNoJyk7XG5cdFx0fSxcblx0XHQnc2VhcmNoJzogKCkgPT4ge1xuXHRcdFx0dGVtcGxhdGVyLnNob3dQYWdlKCdzZWFyY2gnLCB2aWV3KTtcblx0XHR9LFxuXHRcdCdkZXRhaWxzLzppZCc6IChpZCkgPT4ge1xuXHRcdFx0dGVtcGxhdGVyLnNob3dQYWdlKCdkZXRhaWxzJywgdmlldyk7XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG59KSgpO1xuIiwiY29uc3QgcGFnZUNhY2hlID0ge307XG5kZWNsYXJlIHZhciBjdHJsO1xuXG5jbGFzcyBUZW1wbGF0ZXIge1xuXG5cdHNob3dQYWdlKHBhZ2U6IHN0cmluZywgdGFyZ2V0OiBKUXVlcnkpOiB2b2lkIHtcblx0XHRjb25zb2xlLmxvZygnU2hvd2luZyAnICsgcGFnZSk7XG5cdFx0dGhpcy5nZXRQYWdlKHBhZ2UsIChwYWdlRGF0YSkgPT4ge1xuXHRcdFx0Y29uc3Qgdmlld0NvbnRlbnQgPSAkKCc8ZGl2PicgKyBwYWdlRGF0YSArICc8L2Rpdj4nKTtcblx0XHRcdHRoaXMucHJvY2Vzc1N1YnZpZXdzKHZpZXdDb250ZW50KTtcblx0XHRcdHRhcmdldC5lbXB0eSgpLmFwcGVuZCh2aWV3Q29udGVudCk7XG5cdFx0XHR0aGlzLmluaXRDb250cm9sbGVyKHBhZ2UpO1xuXHRcdH0pO1xuXHR9XG5cblx0cHJvY2Vzc1N1YnZpZXdzKHZpZXdDb250ZW50OiBKUXVlcnkpIHtcblx0XHR2aWV3Q29udGVudC5maW5kKCdbZnotc3Vidmlld10nKS5lYWNoKChpLCBlKSA9PiB7XG5cdFx0XHRjb25zdCBzdWJWaWV3ID0gJChlKTtcblx0XHRcdHRoaXMuc2hvd1BhZ2Uoc3ViVmlldy5hdHRyKCdmei1zdWJ2aWV3JyksIHN1YlZpZXcpO1xuXHRcdH0pO1xuXHR9XG5cblx0Z2V0UGFnZShwYWdlOiBzdHJpbmcsIGNiOiAoaWQ6IHN0cmluZykgPT4gdm9pZCkge1xuXHRcdGlmIChwYWdlQ2FjaGVbcGFnZV0pIHtcblx0XHRcdGNiKHBhZ2VDYWNoZVtwYWdlXSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0JC5nZXQoJ3RlbXBsYXRlcy8nICsgcGFnZSArICcuaHRtbCcpLmRvbmUoKHBhZ2VEYXRhKSA9PiB7XG5cdFx0XHRcdHBhZ2VDYWNoZVtwYWdlXSA9IHBhZ2VEYXRhO1xuXHRcdFx0XHRjYihwYWdlRGF0YSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRpbml0Q29udHJvbGxlcihwYWdlOiBzdHJpbmcpIHtcblx0XHRjb25zdCBjdHJsTmFtZSA9IHRoaXMuZGFzaGVkMmNhbWVsKHBhZ2UpO1xuXHRcdGlmICghY3RybFtjdHJsTmFtZV0pIHJldHVybjtcdC8vVE9ETyBkeW5hbWljYWxseSBsb2FkIGNvbnRyb2xsZXJcblx0XHRjdHJsW2N0cmxOYW1lXS5pbml0KCk7XG5cdH1cblxuXHRkYXNoZWQyY2FtZWwoc3RyOiBzdHJpbmcpIHtcblx0XHRjb25zdCBwYXJ0cyA9IHN0ci5zcGxpdCgnLScpO1xuXHRcdGxldCBjYW1lbCA9IHBhcnRzWzBdO1xuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNhbWVsICs9IHRoaXMudWNmaXJzdChwYXJ0c1tpXSk7XG5cdFx0fVxuXHRcdHJldHVybiBjYW1lbDtcblx0fVxuXG5cdHVjZmlyc3Qoc3RyOiBzdHJpbmcpIHtcblx0ICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFRlbXBsYXRlcigpO1xuIl19
