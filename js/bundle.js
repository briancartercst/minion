(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var templater_1 = require('../templater');
templater_1["default"].addController('search', {
    data: {},
    init: function () {
        console.log('ctrl.search init');
    },
    done: function () {
        console.log('ctrl.search done');
    }
});

},{"../templater":3}],2:[function(require,module,exports){
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
var ctrl = {};
//-------------------- Privates --------------------
function showPage(page, target) {
    console.log('Showing ' + page);
    getPage(page, function (pageData) {
        var viewContent = $('<div>' + pageData + '</div>');
        processSubviews(viewContent);
        target.empty().append(viewContent);
        initController(page);
    });
}
function addController(name, controller) {
    ctrl[name] = controller;
}
//-------------------- Privates --------------------
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
function initController(page) {
    var ctrlName = dashed2camel(page);
    if (!ctrl[ctrlName])
        return; //TODO dynamically load controller
    ctrl[ctrlName].init();
}
function dashed2camel(str) {
    var parts = str.split('-');
    var camel = parts[0];
    for (var i = 1; i < parts.length; i++) {
        camel += ucfirst(parts[i]);
    }
    return camel;
}
function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.__esModule = true;
exports["default"] = {
    showPage: showPage,
    addController: addController
};

},{}]},{},[2,1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9jdHJsL3NlYXJjaC50cyIsInRzL21haW4udHMiLCJ0cy90ZW1wbGF0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSwwQkFBc0IsY0FBYyxDQUFDLENBQUE7QUFFckMsc0JBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO0lBQ2pDLElBQUksRUFBRSxFQUFFO0lBRVIsSUFBSTtRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSTtRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQ0QsQ0FBQyxDQUFDOzs7QUNaSCwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBRTNDLDhFQUE4RTtBQUM5RSwwQ0FBMEM7QUFDMUMsMEJBQXNCLGFBQWEsQ0FBQyxDQUFBO0FBRXBDLENBQUM7SUFFRCxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFeEIsQ0FBQyxDQUFDO1FBQ0QsZ0RBQWdEO1FBQ2hELE1BQU0sQ0FBQztZQUNOLEVBQUUsRUFBRTtnQkFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEIsQ0FBQztZQUNELFFBQVEsRUFBRTtnQkFDVCxzQkFBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNELGFBQWEsRUFBRSxVQUFDLEVBQUU7Z0JBQ2pCLHNCQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyQyxDQUFDO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxDQUFDLENBQUMsRUFBRSxDQUFDOzs7QUMxQkwsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLElB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IihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHRlbXBsYXRlciBmcm9tICcuLi90ZW1wbGF0ZXInO1xuXG50ZW1wbGF0ZXIuYWRkQ29udHJvbGxlcignc2VhcmNoJywge1xuXHRkYXRhOiB7fSxcblxuXHRpbml0KCkge1xuXHRcdGNvbnNvbGUubG9nKCdjdHJsLnNlYXJjaCBpbml0Jyk7XG5cdH0sXG5cblx0ZG9uZSgpIHtcblx0XHRjb25zb2xlLmxvZygnY3RybC5zZWFyY2ggZG9uZScpO1xuXHR9XG59KTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHNkL2pxdWVyeS5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90c2Qvcm91dGllLmQudHNcIiAvPlxuXG4vLyBEZWZpbmUgY29udHJvbGxlciBtb2R1bGUgd2l0aCBkdW1teSBleHBvcnQsIHRvIGFsbG93IGR5bmFtaWMgbW9kdWxlIGxvYWRpbmdcbi8vbW9kdWxlIGN0cmwgeyBleHBvcnQgdmFyIGR1bW15ID0gbnVsbDsgfVxuaW1wb3J0IHRlbXBsYXRlciBmcm9tICcuL3RlbXBsYXRlcic7XG5cbihmdW5jdGlvbigpIHtcdC8vVE9ETyByZXBsYWNlIHRoaXMgSUlGIHdpdGggYnVpbGQgc3RlcCwgdG8gZW5jYXBzdWxhdGUgbW9kdWxlcyB0b29cblxuY29uc3QgdmlldyA9ICQoJyN2aWV3Jyk7XG5cbiQoKCkgPT4ge1xuXHQvL1RPRE8gc2hvdyB3YWl0aW5nIGFuaW1hdGlvbiAmIGJsb2NrIGN1cnJlbnQgVUlcblx0cm91dGllKHtcblx0XHQnJzogKCkgPT4ge1xuXHRcdFx0cm91dGllKCdzZWFyY2gnKTtcblx0XHR9LFxuXHRcdCdzZWFyY2gnOiAoKSA9PiB7XG5cdFx0XHR0ZW1wbGF0ZXIuc2hvd1BhZ2UoJ3NlYXJjaCcsIHZpZXcpO1xuXHRcdH0sXG5cdFx0J2RldGFpbHMvOmlkJzogKGlkKSA9PiB7XG5cdFx0XHR0ZW1wbGF0ZXIuc2hvd1BhZ2UoJ2RldGFpbHMnLCB2aWV3KTtcblx0XHR9XG5cdH0pO1xufSk7XG5cbn0pKCk7XG4iLCJjb25zdCBwYWdlQ2FjaGUgPSB7fTtcbmNvbnN0IGN0cmwgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLSBQcml2YXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBzaG93UGFnZShwYWdlOiBzdHJpbmcsIHRhcmdldDogSlF1ZXJ5KTogdm9pZCB7XG5cdGNvbnNvbGUubG9nKCdTaG93aW5nICcgKyBwYWdlKTtcblx0Z2V0UGFnZShwYWdlLCAocGFnZURhdGEpID0+IHtcblx0XHRjb25zdCB2aWV3Q29udGVudCA9ICQoJzxkaXY+JyArIHBhZ2VEYXRhICsgJzwvZGl2PicpO1xuXHRcdHByb2Nlc3NTdWJ2aWV3cyh2aWV3Q29udGVudCk7XG5cdFx0dGFyZ2V0LmVtcHR5KCkuYXBwZW5kKHZpZXdDb250ZW50KTtcblx0XHRpbml0Q29udHJvbGxlcihwYWdlKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZENvbnRyb2xsZXIobmFtZTogc3RyaW5nLCBjb250cm9sbGVyKSB7XG5cdGN0cmxbbmFtZV0gPSBjb250cm9sbGVyO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tIFByaXZhdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHByb2Nlc3NTdWJ2aWV3cyh2aWV3Q29udGVudDogSlF1ZXJ5KTogdm9pZCB7XG5cdHZpZXdDb250ZW50LmZpbmQoJ1tmei1zdWJ2aWV3XScpLmVhY2goKGksIGUpID0+IHtcblx0XHRjb25zdCBzdWJWaWV3ID0gJChlKTtcblx0XHRzaG93UGFnZShzdWJWaWV3LmF0dHIoJ2Z6LXN1YnZpZXcnKSwgc3ViVmlldyk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRQYWdlKHBhZ2U6IHN0cmluZywgY2I6IChpZDogc3RyaW5nKSA9PiB2b2lkKTogdm9pZCB7XG5cdGlmIChwYWdlQ2FjaGVbcGFnZV0pIHtcblx0XHRjYihwYWdlQ2FjaGVbcGFnZV0pO1xuXHR9XG5cdGVsc2Uge1xuXHRcdCQuZ2V0KCd0ZW1wbGF0ZXMvJyArIHBhZ2UgKyAnLmh0bWwnKS5kb25lKChwYWdlRGF0YSkgPT4ge1xuXHRcdFx0cGFnZUNhY2hlW3BhZ2VdID0gcGFnZURhdGE7XG5cdFx0XHRjYihwYWdlRGF0YSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaW5pdENvbnRyb2xsZXIocGFnZTogc3RyaW5nKTogdm9pZCB7XG5cdGNvbnN0IGN0cmxOYW1lID0gZGFzaGVkMmNhbWVsKHBhZ2UpO1xuXHRpZiAoIWN0cmxbY3RybE5hbWVdKSByZXR1cm47XHQvL1RPRE8gZHluYW1pY2FsbHkgbG9hZCBjb250cm9sbGVyXG5cdGN0cmxbY3RybE5hbWVdLmluaXQoKTtcbn1cblxuZnVuY3Rpb24gZGFzaGVkMmNhbWVsKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcblx0Y29uc3QgcGFydHMgPSBzdHIuc3BsaXQoJy0nKTtcblx0bGV0IGNhbWVsID0gcGFydHNbMF07XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcblx0XHRjYW1lbCArPSB1Y2ZpcnN0KHBhcnRzW2ldKTtcblx0fVxuXHRyZXR1cm4gY2FtZWw7XG59XG5cbmZ1bmN0aW9uIHVjZmlyc3Qoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdHNob3dQYWdlLFxuXHRhZGRDb250cm9sbGVyXG59Il19
