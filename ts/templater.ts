//-------------------- Exports --------------------

export default {
	showPage,
	registerController
}

//-------------------- Module variables --------------------

const pageCache = {};
const ctrl = {};
const currentCtrls = [];

//-------------------- Publics --------------------

function showPage(page: string, target: JQuery): void {
	console.log(`Showing page '${page}'`);
	closeControllers();
	showView(page, target);
}

function registerController(name: string, controller) {
	ctrl[name] = controller;
}

//-------------------- Privates --------------------

function showView(viewName: string, target: JQuery): void {
	console.log(`  rendering template '${viewName}'`);
	//TODO show waiting animation & block current UI
	getPage(viewName, (pageData) => {
		const viewContent = $('<div>' + pageData + '</div>');
		processSubviews(viewContent);
		target.empty().append(viewContent);
		initController(viewName);
	});
}

function processSubviews(viewContent: JQuery): void {
	viewContent.find('[fz-subview]').each((i, e) => {
		const subView = $(e);
		showView(subView.attr('fz-subview'), subView);
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
	console.log(`  initializing controller '${ctrlName}'`);
	const currCtrl = ctrl[ctrlName];
	currCtrl.init();
	currCtrl.$name = ctrlName;
	currentCtrls.push(currCtrl);
}

function closeControllers() {
	while (currentCtrls.length > 0) {
		const ctrl = currentCtrls.pop();
		console.log(`  closing controller '${ctrl.$name}'`);
		ctrl.done();
	}
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
