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

const pageCache = {};
const view = $('#view');

function showPage(page: string, target: JQuery = view): void {
	console.log('Showing ' + page);
	getPage(page, (pageData) => {
		const viewContent = $('<div>' + pageData + '</div>');
		processSubviews(viewContent);
		target.empty().append(viewContent);
	});
}

function processSubviews(viewContent: JQuery) {
	viewContent.find('[fz-subview]').each((i, e) => {
		const subView = $(e);
		showPage(subView.attr('fz-subview'), subView);
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
