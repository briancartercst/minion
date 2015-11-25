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
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var templater_1 = __webpack_require__(2);
	var view = $('#view');
	$(function () {
	    routie({
	        '': function () {
	            routie('search');
	        },
	        'search': function () {
	            templater_1.default.showPage('search', view);
	        },
	        'details/:id': function (id) {
	            templater_1.default.showPage('details', view);
	        }
	    });
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	//-------------------- Exports --------------------
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map