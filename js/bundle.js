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
        return;
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
//# sourceMappingURL=bundle.js.map
