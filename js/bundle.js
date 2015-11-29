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
	__webpack_require__(4);
	module.exports = __webpack_require__(5);


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
	        'user/:id': function (id) { return templater_1.default.showPage('user-edit', view, id); },
	        'details/:id': function (id) { return templater_1.default.showPage('details', view); }
	    });
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	//-------------------- Exports --------------------
	window['$model'] = window['$model'] || {};
	var model = window['$model'];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    showPage: showPage,
	    registerController: registerController,
	    model: model
	};
	//-------------------- Module variables --------------------
	var pageCache = {};
	var ctrl = {};
	var currentCtrls = [];
	//-------------------- Publics --------------------
	function showPage(page, target, extra) {
	    console.log("Showing page '" + page + "'");
	    closeControllers();
	    showView(page, target, extra);
	}
	function registerController(name, controller) {
	    ctrl[name] = controller;
	}
	//-------------------- Privates --------------------
	function showView(viewName, target, extra) {
	    //TODO show waiting animation & block current UI
	    return new Promise(function (resolve, reject) {
	        console.log("  rendering template '" + viewName + "'");
	        preRenderController(viewName, extra)
	            .then(function () {
	            getPage(viewName)
	                .then(function (pageData) {
	                var viewContent = $('<div>' + Mustache.render(pageData, model) + '</div>');
	                processSubviews(viewContent, extra)
	                    .then(function () {
	                    target.empty().append(viewContent);
	                    postRenderController(viewName);
	                    resolve(viewContent);
	                });
	            });
	        });
	    });
	}
	function processSubviews(viewContent, extra) {
	    var showPromises = [];
	    return new Promise(function (resolve) {
	        viewContent.find('[fz-subview]').each(function (i, e) {
	            var subView = $(e);
	            showPromises.push(showView(subView.attr('fz-subview'), subView, extra));
	        });
	        Promise.all(showPromises).then(function (results) {
	            resolve();
	        });
	    });
	}
	function getPage(page) {
	    return new Promise(function (resolve) {
	        if (pageCache[page]) {
	            resolve(pageCache[page]);
	        }
	        else {
	            $.get('templates/' + page + '.html').done(function (pageData) {
	                pageCache[page] = pageData;
	                Mustache.parse(pageData);
	                resolve(pageData);
	            });
	        }
	    });
	}
	function preRenderController(ctrlName, extra) {
	    if (ctrl[ctrlName]) {
	        // Add controller
	        // TODO this should be done elsewhere
	        var currCtrl = ctrl[ctrlName];
	        currCtrl.$name = ctrlName;
	        currentCtrls.push(currCtrl);
	        // Call prerender
	        if (currCtrl.preRender) {
	            var result = currCtrl.preRender(extra);
	            if (result instanceof Promise)
	                return result;
	        }
	    }
	    return Promise.resolve();
	}
	function postRenderController(ctrlName) {
	    if (!ctrl[ctrlName])
	        return;
	    var currCtrl = ctrl[ctrlName];
	    if (currCtrl.postRender)
	        currCtrl.postRender();
	}
	function closeControllers() {
	    while (currentCtrls.length > 0) {
	        var ctrl_1 = currentCtrls.pop();
	        if (ctrl_1.done)
	            ctrl_1.done();
	    }
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var templater_1 = __webpack_require__(2);
	templater_1.default.registerController('search', {
	    data: {},
	    postRender: function () {
	        console.log('ctrl.search postRender');
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
	templater_1.default.registerController('user-edit', {
	    preRender: function (id) {
	        console.log('user-edit init:', id);
	        var usr = templater_1.default.model.users[id];
	        console.log('user:', usr);
	    }
	});


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var templater_1 = __webpack_require__(2);
	templater_1.default.registerController('users', {
	    preRender: function () {
	        return getData().then(function (users) {
	            templater_1.default.model.users = users;
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