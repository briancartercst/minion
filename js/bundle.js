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
	__webpack_require__(6);
	module.exports = __webpack_require__(7);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	var view = $('#view');
	setupLoadingPopup();
	$(function () {
	    routie({
	        '': function () { return routie('search'); },
	        'search': function () { return minion_1.default.showView('search', view); },
	        'users': function () { return minion_1.default.showView('users', view); },
	        'user/:id': function (id) { return minion_1.default.showView('user-edit', view, id); },
	        'details/:id': function (id) { return minion_1.default.showView('details', view); }
	    });
	});
	function setupLoadingPopup() {
	    var isLoading = false;
	    var LOAD_POPUP_DELAY = 100;
	    minion_1.default.showLoading = function () {
	        isLoading = true;
	        setTimeout(function () {
	            if (!isLoading)
	                return;
	            $('#loading-cover').show();
	            $('#loading-popup').show();
	        }, LOAD_POPUP_DELAY);
	    };
	    minion_1.default.hideLoading = function () {
	        isLoading = false;
	        $('#loading-cover').hide();
	        $('#loading-popup').hide();
	    };
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	//-------------------- Exports --------------------
	var minion = {
	    rootModel: {},
	    showView: showView,
	    controller: controller,
	    component: component,
	    form2obj: form2obj,
	    config: {
	        templatePath: 'templates/'
	    },
	    showLoading: showLoading,
	    hideLoading: hideLoading
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = minion;
	//-------------------- Module variables --------------------
	var pageCache = {};
	var ctrlRegistry = {};
	var cmpRegistry = {};
	//-------------------- Publics --------------------
	function showView(page, target, extra) {
	    console.log("Showing view '" + page + "'");
	    minion.showLoading();
	    target = target || $("[mn-view=" + page + "]");
	    return showViewRecursive(page, target, minion.rootModel, extra)
	        .then(function (viewContent) {
	        minion.hideLoading();
	        return viewContent;
	    });
	}
	function controller(name, controller) {
	    ctrlRegistry[name] = controller;
	}
	function component(name, component) {
	    cmpRegistry[name] = component;
	}
	function form2obj(form) {
	    var result = {};
	    for (var _i = 0, _a = form.serializeArray(); _i < _a.length; _i++) {
	        var input = _a[_i];
	        if (input.value)
	            result[input.name] = Mustache.escape(input.value);
	        var inputType = form.find(":input[name=" + input.name + "]").attr('type');
	        if (inputType == 'number')
	            result[input.name] = parseFloat(input.value);
	        else if (inputType == 'checkbox')
	            result[input.name] = true;
	    }
	    return result;
	}
	//-------------------- Privates --------------------
	function showViewRecursive(viewName, target, parent, extra) {
	    console.log("  rendering template '" + viewName + "'");
	    var ctrl = ctrlRegistry[viewName] || {};
	    ctrl.$parent = parent;
	    return preRenderController(ctrl, extra)
	        .then(function () {
	        return getPage(viewName);
	    })
	        .then(function (pageData) {
	        var renderCtx = getRenderContext(ctrl);
	        var viewContent = $('<div>' + Mustache.render(pageData, renderCtx) + '</div>');
	        return processSubviews(viewContent, ctrl, extra);
	    })
	        .then(function (viewContent) {
	        target.empty().append(viewContent);
	        processComponents(viewContent);
	        registerEventHandlers(ctrl, viewContent, ['click', 'submit']);
	        postRenderController(ctrl, viewContent);
	        return viewContent;
	    });
	}
	function processSubviews(viewContent, parent, extra) {
	    var showPromises = [];
	    viewContent.find('[mn-view]').each(function (i, e) {
	        var subView = $(e);
	        showPromises.push(showViewRecursive(subView.attr('mn-view'), subView, parent, extra));
	    });
	    return Promise.all(showPromises).then(function (results) {
	        return viewContent;
	    });
	}
	function getPage(page) {
	    return new Promise(function (resolve) {
	        if (pageCache[page]) {
	            resolve(pageCache[page]);
	        }
	        else {
	            $.get(minion.config.templatePath + page + '.html').done(function (pageData) {
	                pageCache[page] = pageData;
	                Mustache.parse(pageData);
	                resolve(pageData);
	            });
	        }
	    });
	}
	function registerEventHandlers(ctrl, viewContent, events) {
	    for (var _i = 0; _i < events.length; _i++) {
	        var eventId = events[_i];
	        var mnAttr = "mn-" + eventId;
	        viewContent.find("[" + mnAttr + "]").each(function (i, elem) {
	            var handlerName = $(elem).attr(mnAttr);
	            if (ctrl[handlerName])
	                $(elem).on(eventId, function () {
	                    return ctrl[handlerName]($(this));
	                });
	        });
	    }
	}
	function showLoading() {
	    console.log('Loading...');
	}
	function hideLoading() {
	    console.log('...Done');
	}
	//---------- Controllers ----------
	function preRenderController(ctrl, extra) {
	    if (ctrl.preRender) {
	        var result = ctrl.preRender(extra);
	        if (result instanceof Promise)
	            return result;
	    }
	    return Promise.resolve();
	}
	function postRenderController(ctrl, viewContent) {
	    if (ctrl.postRender)
	        ctrl.postRender(viewContent);
	    if (ctrl.done)
	        viewContent.bind('destroyed', function () {
	            ctrl.done();
	        });
	}
	function getRenderContext(ctrl) {
	    var ctrls = [];
	    while (ctrl) {
	        ctrls.push(ctrl);
	        ctrl = ctrl.$parent;
	    }
	    return $.extend.apply(null, [{}].concat(ctrls.reverse()));
	}
	//---------- Components ----------
	function processComponents(viewContent) {
	    viewContent.find('[mn-component]').each(function (i, e) {
	        processComponent($(e));
	    });
	}
	function processComponent(node) {
	    var compName = node.attr('mn-component');
	    node.removeAttr('mn-component').attr('mn-component-rendered', compName);
	    var component = cmpRegistry[compName];
	    if (!component) {
	        console.warn("Component " + compName + " not found");
	        return;
	    }
	    component.render(node, attrs2obj(node[0].attributes));
	}
	function attrs2obj(attrs) {
	    var result = {};
	    for (var i = 0; i < attrs.length; i++) {
	        var attr = attrs[i];
	        result[attr.name] = Mustache.escape(attr.value);
	    }
	    return result;
	}
	//--------------- Startup  ---------------
	$['event'].special.destroyed = {
	    remove: function (o) { return (o && o.handler) ? o.handler() : null; }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	minion_1.default.controller('search', {
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
	    },
	    hello: function (evt) {
	        alert('hello!');
	        console.log(evt);
	    }
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	var users_1 = __webpack_require__(5);
	minion_1.default.controller('user-edit', {
	    preRender: function (id) {
	        this.user = minion_1.default.rootModel.users[id];
	    },
	    save: function (elem) {
	        users_1.default.saveUser(minion_1.default.form2obj(elem)).then(function () {
	            window.location.href = '#users';
	        });
	        return false;
	    }
	});


/***/ },
/* 5 */
/***/ function(module, exports) {

	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    getUsers: getUsers,
	    saveUser: saveUser,
	    deleteUser: deleteUser
	};
	function getUsers(filter) {
	    return new Promise(function (resolve) {
	        setTimeout(function () {
	            var data = [];
	            for (var i = 0; i < 10; i++)
	                data.push(createUser(i));
	            resolve(data);
	        }, 1000);
	    });
	}
	function saveUser(u) {
	    return Promise.resolve(undefined);
	}
	function deleteUser(id) {
	    return Promise.resolve(undefined);
	}
	//-------------------- Public --------------------
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	var users_1 = __webpack_require__(5);
	minion_1.default.controller('users', {
	    searchUsers: function (elem) {
	        minion_1.default.rootModel.userFilter = minion_1.default.form2obj(elem);
	        minion_1.default.showView('user-table');
	        return false;
	    }
	});
	minion_1.default.controller('user-table', {
	    preRender: function () {
	        return users_1.default.getUsers(minion_1.default.rootModel.userFilter).then(function (users) {
	            minion_1.default.rootModel.users = users;
	        });
	    },
	    postRender: function (viewContent) {
	        var _this = this;
	        $('#modal-delete-btn').click(function () {
	            if (!_this.delUserId)
	                return;
	            console.log('Deleting user:', _this.delUserId);
	            users_1.default.deleteUser(_this.delUserId);
	        });
	    },
	    done: function () {
	        $('#modal-delete-btn').unbind('click');
	    },
	    openDeletePopup: function (button) {
	        this.delUserId = button.attr('data-delete-id');
	    }
	});


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	minion_1.default.component('input-wide', {
	    render: function (node, attrs) {
	        attrs = getInputAttrs(attrs);
	        var template = "\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"" + attrs.name + "\" class=\"col-sm-3 control-label\">" + attrs.label + "</label>\n\t\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t\t<input class=\"form-control\" id=\"" + attrs.name + "\" name=\"" + attrs.name + "\"\n\t\t\t\t\t\tvalue=\"" + attrs.value + "\" type=\"" + attrs.type + "\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t";
	        node.html(template);
	    }
	});
	minion_1.default.component('input-narrow', {
	    render: function (node, attrs) {
	        attrs = getInputAttrs(attrs);
	        var template = "\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"" + attrs.name + "\">" + attrs.label + "</label>\n\t\t\t\t<input class=\"form-control\" id=\"" + attrs.name + "\" name=\"" + attrs.name + "\"\n\t\t\t\t\tvalue=\"" + attrs.value + "\" type=\"" + attrs.type + "\">\n\t\t\t</div>\n\t\t";
	        node.html(template);
	    }
	});
	///--------------------------------------------------
	function getInputAttrs(attrs) {
	    attrs.type = attrs.type || 'text';
	    attrs.value = attrs.value || '';
	    return attrs;
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map