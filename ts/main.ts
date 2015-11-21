/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/routie.d.ts" />

// Define controller module with dummy export, to allow dynamic module loading
module ctrl { export var dummy = null; }

(function() {

const pageCache = {};
const view = $('#view');

$(() => {
	//TODO show waiting animation & block current UI
	routie({
		'': () => {
			routie('search');
		},
		'search': () => {
			templater.showPage('search');
		},
		'details/:id': (id) => {
			templater.showPage('details');
		}
	});
});

//TODO move to separate module
class Templater {

	showPage(page: string, target: JQuery = view): void {
		console.log('Showing ' + page);
		this.getPage(page, (pageData) => {
			const viewContent = $('<div>' + pageData + '</div>');
			this.processSubviews(viewContent);
			target.empty().append(viewContent);
			this.initController(page);
		});
	}

	processSubviews(viewContent: JQuery) {
		viewContent.find('[fz-subview]').each((i, e) => {
			const subView = $(e);
			this.showPage(subView.attr('fz-subview'), subView);
		});
	}

	getPage(page: string, cb: (id: string) => void) {
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

	initController(page: string) {
		const ctrlName = this.dashed2camel(page);
		if (!ctrl[ctrlName]) return;
		ctrl[ctrlName].init();
	}

	dashed2camel(str: string) {
		return str; //TODO implement
	}
}

var templater = new Templater();

})();
