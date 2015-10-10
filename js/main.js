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
			view.empty().append($(pageData));
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
//# sourceMappingURL=main.js.map