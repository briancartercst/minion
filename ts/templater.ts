//-------------------- Exports --------------------

export default {
	showPage,
	registerController,
	applyTemplate
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

function applyTemplate(src: string, data: Object, dst: string) {
	const template = $('#' + src).html();
	Mustache.parse(template);
	const rendered = Mustache.render(template, data);
	$('#' + dst).html(rendered);
}
//-------------------- Privates --------------------

function showView(viewName: string, target: JQuery): Promise<JQuery> {
	//TODO show waiting animation & block current UI
	return new Promise<JQuery>((resolve, reject) => {
		console.log(`  rendering template '${viewName}'`);
		getPage(viewName, (pageData) => {
			const viewContent = $('<div>' + pageData + '</div>');
			processSubviews(viewContent)
			.then(() => {
				target.empty().append(viewContent);
				initController(viewName);
				resolve(viewContent);
			});
		});
	});
}

function processSubviews(viewContent: JQuery): Promise<void> {
	const showPromises: Promise<JQuery>[] = [];
	return new Promise<void>((resolve, reject) => {
		viewContent.find('[fz-subview]').each((i, e) => {
			const subView = $(e);
			showPromises.push(showView(subView.attr('fz-subview'), subView));
		});
		Promise.all(showPromises).then(results => {
			resolve();
		});
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
