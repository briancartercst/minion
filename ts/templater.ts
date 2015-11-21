const pageCache = {};
const ctrl = {};

//-------------------- Publics --------------------

function showPage(page: string, target: JQuery): void {
	//TODO separate recursive part in a different function.
	// Then, shutdown previous controllers.
	console.log('Showing ' + page);
	//TODO show waiting animation & block current UI
	getPage(page, (pageData) => {
		const viewContent = $('<div>' + pageData + '</div>');
		processSubviews(viewContent);
		target.empty().append(viewContent);
		initController(page);
	});
}

function addController(name: string, controller) {
	ctrl[name] = controller;
}

//-------------------- Privates --------------------

function processSubviews(viewContent: JQuery): void {
	viewContent.find('[fz-subview]').each((i, e) => {
		const subView = $(e);
		showPage(subView.attr('fz-subview'), subView);
	});
}

function getPage(page: string, cb: (id: string) => void): void {
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

function initController(page: string): void {
	const ctrlName = dashed2camel(page);
	if (!ctrl[ctrlName]) return;
	ctrl[ctrlName].init();
}

function dashed2camel(str: string): string {
	const parts = str.split('-');
	let camel = parts[0];
	for (let i = 1; i < parts.length; i++) {
		camel += ucfirst(parts[i]);
	}
	return camel;
}

function ucfirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}


//-------------------- Exports --------------------

export default {
	showPage,
	addController
}