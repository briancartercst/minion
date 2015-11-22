(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var templater_1 = require('../templater');
templater_1["default"].registerController('search', {
    data: {},
    init: function () {
        console.log('ctrl.search init');
        $("#price-range").slider({});
    },
    done: function () {
        console.log('ctrl.search done');
    }
});

},{"../templater":3}],2:[function(require,module,exports){
/// <reference path="../tsd/es6-promise.d.ts" />
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/bootstrap-slider.d.ts" />
/// <reference path="../tsd/routie.d.ts" />
// Define controller module with dummy export, to allow dynamic module loading
//module ctrl { export var dummy = null; }
var templater_1 = require('./templater');
var view = $('#view');
$(function () {
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

},{"./templater":3}],3:[function(require,module,exports){
//-------------------- Exports --------------------
exports.__esModule = true;
exports["default"] = {
    showPage: showPage,
    registerController: registerController
};
//-------------------- Module variables --------------------
var pageCache = {};
var ctrl = {};
var currentCtrls = [];
//-------------------- Publics --------------------
function showPage(page, target) {
    console.log("Showing page '" + page + "'");
    closeControllers();
    showView(page, target);
}
function registerController(name, controller) {
    ctrl[name] = controller;
}
//-------------------- Privates --------------------
function showView(viewName, target) {
    console.log("  rendering template '" + viewName + "'");
    //TODO show waiting animation & block current UI
    getPage(viewName, function (pageData) {
        var viewContent = $('<div>' + pageData + '</div>');
        processSubviews(viewContent);
        target.empty().append(viewContent);
        initController(viewName);
    });
}
function processSubviews(viewContent) {
    viewContent.find('[fz-subview]').each(function (i, e) {
        var subView = $(e);
        showView(subView.attr('fz-subview'), subView);
    });
}
function getPage(page, cb) {
    var p = new Promise(function (resolve) {
        resolve("hehe");
    });
    p.then(function (s) {
        console.log("Promises work: ", s);
    });
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
    console.log("  initializing controller '" + ctrlName + "'");
    var currCtrl = ctrl[ctrlName];
    currCtrl.init();
    currCtrl.$name = ctrlName;
    currentCtrls.push(currCtrl);
}
function closeControllers() {
    while (currentCtrls.length > 0) {
        var ctrl_1 = currentCtrls.pop();
        console.log("  closing controller '" + ctrl_1.$name + "'");
        ctrl_1.done();
    }
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

},{}]},{},[2,1])
//# sourceMappingURL=bundle.js.map
