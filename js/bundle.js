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
	__webpack_require__(5);
	module.exports = __webpack_require__(6);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	var view = $('#view');
	setupLoadingPopup();
	$(function () {
	    routie({
	        '': function () { return routie('search'); },
	        'search': function () { return minion_1.default.render('search', view); },
	        'users': function () { return minion_1.default.render('users', view); },
	        //TODO think of a clean way to pass "id" and other route parameters
	        'user/:id': function (id) { return minion_1.default.render('user-edit', view); },
	        'details/:id': function (id) { return minion_1.default.render('details', view); }
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

	//-------------------- Exports & interfaces --------------------
	var minion = {
	    render: render,
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
	var templates = {}; // Template cache
	var components = {}; // Component registry
	//-------------------- Publics --------------------
	function render(tagName, node) {
	    minion.showLoading();
	    return renderRecursive(tagName, node)
	        .then(function (viewContent) {
	        minion.hideLoading();
	        return viewContent;
	    });
	}
	function component(name, component) {
	    components[name] = component;
	}
	function showLoading() {
	    console.log('Loading...');
	}
	function hideLoading() {
	    console.log('...Loaded');
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
	function renderRecursive(tagName, target) {
	    var component = getComponent(tagName);
	    return (component.init(target) || Promise.resolve())
	        .then(function () {
	        return getTemplate(tagName, component);
	    })
	        .then(function (template) {
	        var node = $('<div>' + Mustache.render(template, component) + '</div>');
	        return renderSubcomponents(node);
	    })
	        .then(function (node) {
	        target.empty().append(node);
	        registerEventHandlers(component, node);
	        component.ready(node);
	        if (component.done)
	            node.bind('destroyed', component.done);
	        return node;
	    });
	}
	function getComponent(tagName) {
	    var compDef = components[tagName] || {};
	    var component = (compDef instanceof Function) ? new compDef() : $.extend({}, compDef);
	    component.init = component.init || function () { };
	    component.ready = component.ready || function () { };
	    return component;
	}
	function getTemplate(tagName, component) {
	    return new Promise(function (resolve) {
	        if (templates[tagName])
	            resolve(templates[tagName]);
	        else
	            return getTemplateFromComponent(tagName, component)
	                .then(function (pageData) {
	                Mustache.parse(pageData);
	                if (!component.dynamic)
	                    templates[tagName] = pageData;
	                resolve(pageData);
	            });
	    });
	}
	function getTemplateFromComponent(tagName, component) {
	    return new Promise(function (resolve) {
	        if (component.template)
	            return resolve(component.template);
	        var templateUrl = component.templateUrl || tagName;
	        $.get(minion.config.templatePath + templateUrl + '.html')
	            .done(function (pageData) { return resolve(pageData); });
	    });
	}
	function registerEventHandlers(component, node) {
	    for (var _i = 0, _a = ['click', 'submit']; _i < _a.length; _i++) {
	        var eventId = _a[_i];
	        var mnAttr = "mn-" + eventId;
	        node.find("[" + mnAttr + "]").each(function (i, elem) {
	            var handlerName = $(elem).attr(mnAttr);
	            if (component[handlerName])
	                $(elem).on(eventId, function () {
	                    return component[handlerName]($(this));
	                });
	        });
	    }
	}
	function renderSubcomponents(node) {
	    var promises = [];
	    node.find(getComponentsQuery()).each(function (i, e) {
	        promises.push(renderRecursive(e.localName, $(e)));
	    });
	    return Promise.all(promises).then(function () { return node; });
	}
	function getComponentsQuery() {
	    var compTags = [];
	    for (var tag in components)
	        if (components.hasOwnProperty(tag))
	            compTags.push(tag);
	    return compTags.join(',');
	}
	//--------------- Setup  ---------------
	$['event'].special.destroyed = {
	    remove: function (o) { return (o && o.handler) ? o.handler() : null; }
	};
	var viewCache = {};
	component('mn-view', (function () {
	    function class_1() {
	        this.dynamic = true;
	    }
	    class_1.prototype.init = function (node) {
	        var _this = this;
	        return new Promise(function (resolve) {
	            var viewName = node.attr('template');
	            if (viewCache[viewName]) {
	                _this.template = viewCache[viewName];
	                resolve();
	            }
	            else {
	                $.get(minion.config.templatePath + viewName + '.html')
	                    .done(function (pageData) {
	                    _this.template = pageData;
	                    viewCache[viewName] = pageData;
	                    resolve();
	                });
	            }
	        });
	    };
	    return class_1;
	})());


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	minion_1.default.component('input-wide', (function () {
	    function class_1() {
	        this.template = "\n\t\t<div class=\"form-group\">\n\t\t\t<label for=\"{{attrs.name}}\" class=\"col-sm-3 control-label\">{{attrs.label}}</label>\n\t\t\t<div class=\"col-sm-9\">\n\t\t\t\t<input class=\"form-control\" id=\"{{attrs.name}}\" name=\"{{attrs.name}}\"\n\t\t\t\t\tvalue=\"{{attrs.value}}\" type=\"{{attrs.type}}\">\n\t\t\t</div>\n\t\t</div>\n\t";
	    }
	    class_1.prototype.init = function (node) {
	        this.attrs = getInputAttrs(node);
	    };
	    return class_1;
	})());
	minion_1.default.component('input-narrow', (function () {
	    function class_2() {
	        this.template = "\n\t\t<div class=\"form-group\">\n\t\t\t<label for=\"{{attrs.name}}\">{{attrs.label}}</label>\n\t\t\t<input class=\"form-control\" id=\"{{attrs.name}}\" name=\"{{attrs.name}}\"\n\t\t\t\tvalue=\"{{attrs.value}}\" type=\"{{attrs.type}}\">\n\t\t</div>\n\t";
	    }
	    class_2.prototype.init = function (node) {
	        this.attrs = getInputAttrs(node);
	    };
	    return class_2;
	})());
	///--------------------------------------------------
	function getInputAttrs(node) {
	    var attrs = {};
	    for (var _i = 0, _a = 'name label value type'.split(' '); _i < _a.length; _i++) {
	        var attr = _a[_i];
	        attrs[attr] = node.attr(attr);
	    }
	    attrs.type = attrs.type || 'text';
	    attrs.value = attrs.value || '';
	    return attrs;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	minion_1.default.component('search', (function () {
	    function class_1() {
	    }
	    class_1.prototype.init = function () {
	        this.potato = "I am a potato";
	    };
	    class_1.prototype.ready = function () {
	        console.log('search ready', arguments);
	        $('#price-range').slider({});
	        $('.slider-selection').css({
	            backgroundImage: 'initial',
	            backgroundColor: '#AAA'
	        });
	    };
	    class_1.prototype.hello = function (evt) {
	        alert('hello!');
	        console.log(evt);
	    };
	    return class_1;
	})());


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	minion_1.default.component('user-edit', {
	    init: function (id) {
	        // TODO adapt
	        // this.user = minion.rootModel.users[id];
	    },
	    save: function (elem) {
	        // TODO adapt
	        // userSvc.saveUser(<any>minion.form2obj(elem)).then(() => {
	        // 	window.location.href = '#users';
	        // });
	        return false;
	    }
	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var minion_1 = __webpack_require__(2);
	var users_1 = __webpack_require__(7);
	minion_1.default.component('users', (function () {
	    function class_1() {
	    }
	    class_1.prototype.searchUsers = function (elem) {
	        // TODO adapt
	        // minion.rootModel.userFilter = minion.form2obj(elem);
	        // minion.showView('user-table');
	        return false;
	    };
	    return class_1;
	})());
	minion_1.default.component('user-table', {
	    init: function () {
	        // TODO adapt
	        // return userSvc.getUsers(minion.rootModel.userFilter).then(users => {
	        // 	minion.rootModel.users = users;
	        // });
	    },
	    ready: function (viewContent) {
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map