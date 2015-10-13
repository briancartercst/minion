(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {

	$(function () {
		//TODO show waiting animation & block current UI
		routie({
			'': function _() {
				routie('search');
			},
			'search': function search() {
				showPage('search');
			},
			'details/:id': function detailsId(id) {
				showPage('details');
			}
		});
	});

	var pageCache = {};
	var view = $('#view');

	function showPage(page) {
		console.log('Showing ' + page);
		getPage(page, function (pageData) {
			view.empty().append($('<div>' + pageData + '</div>'));
		});
	}

	function getPage(page, cb) {
		if (pageCache[page]) {
			cb(pageCache[page]);
		} else {
			$.get('templates/' + page + '.html').done(function (pageData) {
				pageCache[page] = pageData;
				cb(pageData);
			});
		}
	}
})();

},{}]},{},[1])
//# sourceMappingURL=main.js.map
