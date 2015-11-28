/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	module.exports = __webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var templater_1 = __webpack_require__(2);
	var view = $('#view');
	$(function () {
	    routie({
	        '': function () { return routie('search'); },
	        'search': function () { return templater_1.default.showPage('search', view); },
	        'users': function () { return templater_1.default.showPage('users', view); },
	        'details/:id': function (id) { return templater_1.default.showPage('details', view); }
	    });
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	//-------------------- Exports --------------------
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    showPage: showPage,
	    registerController: registerController,
	    applyTemplate: applyTemplate
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
	function applyTemplate(src, data, dst) {
	    var template = $('#' + src).html();
	    Mustache.parse(template);
	    var rendered = Mustache.render(template, data);
	    $('#' + dst).html(rendered);
	}
	//-------------------- Privates --------------------
	function showView(viewName, target) {
	    //TODO show waiting animation & block current UI
	    return new Promise(function (resolve, reject) {
	        console.log("  rendering template '" + viewName + "'");
	        getPage(viewName, function (pageData) {
	            var viewContent = $('<div>' + pageData + '</div>');
	            processSubviews(viewContent)
	                .then(function () {
	                target.empty().append(viewContent);
	                initController(viewName);
	                resolve(viewContent);
	            });
	        });
	    });
	}
	function processSubviews(viewContent) {
	    var showPromises = [];
	    return new Promise(function (resolve, reject) {
	        viewContent.find('[fz-subview]').each(function (i, e) {
	            var subView = $(e);
	            showPromises.push(showView(subView.attr('fz-subview'), subView));
	        });
	        Promise.all(showPromises).then(function (results) {
	            resolve();
	        });
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var templater_1 = __webpack_require__(2);
	templater_1.default.registerController('search', {
	    data: {},
	    init: function () {
	        console.log('ctrl.search init');
	        $('#price-range').slider({});
	        $('.slider-selection').css({
	            backgroundImage: 'initial',
	            backgroundColor: '#AAA'
	        });
	    },
	    done: function () {
	        console.log('ctrl.search done');
	    }
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var templater_1 = __webpack_require__(2);
	templater_1.default.registerController('users', {
	    init: function () {
	        getData().then(function (users) {
	            templater_1.default.applyTemplate('template-users', { users: users }, 'place-users');
	        });
	    }
	});
	function getData() {
	    var data = [];
	    for (var i = 0; i < 10; i++)
	        data.push(createUser(i));
	    return Promise.resolve(data);
	}
	function createUser(id) {
	    var usr = {};
	    usr.name = randomName(3, 6);
	    usr.surname = randomName(4, 7);
	    usr.email = usr.name + '.' + usr.surname + '@gmail.com';
	    usr.mobile = randomMobile();
	    usr.id = id;
	    return usr;
	}
	var CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
	var VOWELS = 'aeiou';
	function randomName(min, max) {
	    var name = '';
	    var letters;
	    var len = randomNum(min, max);
	    for (var i = 0; i < len; i++) {
	        letters = (i % 2 == 0) ? CONSONANTS : VOWELS;
	        name += letters[randomNum(0, letters.length)];
	        if (name.length == 1)
	            name = name.toUpperCase();
	    }
	    return name;
	}
	function randomMobile() {
	    var num = '6';
	    for (var i = 1; i < 9; i++) {
	        if (i % 3 == 0)
	            num += ' ';
	        num += randomNum(0, 10);
	    }
	    return num;
	}
	function randomNum(min, max) {
	    return min + Math.floor(Math.random() * (max - min));
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map