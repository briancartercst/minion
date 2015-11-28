//-------------------- Exports --------------------

export default {
	showPage,
	registerController,
	applyTemplate,
	getModel
}

//-------------------- Module variables --------------------

window['$model'] = window['$model'] || {};

const pageCache = {};
const ctrl = {};
const currentCtrls = [];
const model = window['$model'];

//-------------------- Publics --------------------

function showPage(page: string, target: JQuery, extra?: string): void {
	console.log(`Showing page '${page}'`);
	closeControllers();
	showView(page, target, extra);
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

function getModel() {
	return model;
}
//-------------------- Privates --------------------

function showView(viewName: string, target: JQuery, extra: string): Promise<JQuery> {
	//TODO show waiting animation & block current UI
	return new Promise<JQuery>((resolve, reject) => {
		console.log(`  rendering template '${viewName}'`);
		getPage(viewName, (pageData) => {
			const viewContent = $('<div>' + pageData + '</div>');
			processSubviews(viewContent, extra)
			.then(() => {
				target.empty().append(viewContent);
				initController(viewName, extra);
				resolve(viewContent);
			});
		});
	});
}

function processSubviews(viewContent: JQuery, extra: string): Promise<void> {
	const showPromises: Promise<JQuery>[] = [];
	return new Promise<void>((resolve, reject) => {
		viewContent.find('[fz-subview]').each((i, e) => {
			const subView = $(e);
			showPromises.push(showView(subView.attr('fz-subview'), subView, extra));
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

function initController(ctrlName: string, extra: string): void {
	if (!ctrl[ctrlName]) return;
	console.log(`  initializing controller '${ctrlName}'`);
	const currCtrl = ctrl[ctrlName];
	if (currCtrl.init) currCtrl.init(extra);
	currCtrl.$name = ctrlName;
	currentCtrls.push(currCtrl);
}

function closeControllers() {
	while (currentCtrls.length > 0) {
		const ctrl = currentCtrls.pop();
		console.log(`  closing controller '${ctrl.$name}'`);
		if (ctrl.done) ctrl.done();
	}
}
