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

function showPage(page) {
	console.log('Showing ' + page);
	getPage(page, (pageData) => {
		view.empty().append($(pageData));
	});
}

function getPage(page, cb) {
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

