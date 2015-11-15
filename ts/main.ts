/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/routie.d.ts" />

(function() {

$(() => {
	//TODO show waiting animation & block current UI
	routie({
		'': () => {
			routie('search');
		},
		'search': () => {
			showPage('search');
		},
		'details/:id': (id) => {
			showPage('details');
		}
	});
});

var pageCache = {};
var view = $('#view');

function showPage(page: string): void {
	console.log('Showing ' + page);
	getPage(page, (pageData) => {
		view.empty().append($('<div>' + pageData + '</div>'));
	});
}

function getPage(page: string, cb: (id: string)=>void) {
	if (pageCache[page]) {
		cb(pageCache[page]);
	}
	else {
		$.get('templates/' + page + '.html').done((pageData) => {
			pageCache[page] = pageData;
			cb(pageData);
		});
	}
}

})();

