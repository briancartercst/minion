//-------------------- Exports --------------------

window['$model'] = window['$model'] || {};
const model = window['$model'];

export default {
	showPage,
	registerController,
	model
}

//-------------------- Module variables --------------------

const pageCache = {};
const ctrl = {};
const currentCtrls = [];

//-------------------- Publics --------------------

function showPage(page: string, target: JQuery, extra?: string): void {
	console.log(`Showing page '${page}'`);
	closeControllers();
	showView(page, target, extra);
}

function registerController(name: string, controller) {
	ctrl[name] = controller;
}


//-------------------- Privates --------------------

function showView(viewName: string, target: JQuery, extra: string): Promise<JQuery> {
	//TODO show waiting animation & block current UI
	return new Promise<JQuery>(resolve => {
		console.log(`  rendering template '${viewName}'`);
		preRenderController(viewName, extra)
		.then(() => {
			return getPage(viewName);
		})
		.then(pageData => {
			const viewContent = $('<div>' + Mustache.render(pageData, model) + '</div>');
			return processSubviews(viewContent, extra);
		})
		.then(viewContent => {
			target.empty().append(viewContent);
			//TODO process custom components here
			postRenderController(viewName);
			resolve(viewContent);
		});
	});
}

function processSubviews(viewContent: JQuery, extra: string): Promise<JQuery> {
	const showPromises: Promise<JQuery>[] = [];
	return new Promise(resolve => {
		viewContent.find('[fz-subview]').each((i, e) => {
			const subView = $(e);
			showPromises.push(showView(subView.attr('fz-subview'), subView, extra));
		});
		Promise.all(showPromises).then(results => {
			resolve(viewContent);
		});
	});
}

function getPage(page: string): Promise<string> {
	return new Promise(resolve => {
		if (pageCache[page]) {
			resolve(pageCache[page]);
		}
		else {
			$.get('templates/' + page + '.html').done((pageData) => {
				pageCache[page] = pageData;
				Mustache.parse(pageData);
				resolve(pageData);
			});
		}
	});
}

function preRenderController(ctrlName: string, extra: string): Promise<any> {
	if (ctrl[ctrlName]) {
		// Add controller
		// TODO this should be done elsewhere
		const currCtrl = ctrl[ctrlName];
		currCtrl.$name = ctrlName;
		currentCtrls.push(currCtrl);
		// Call prerender
		if (currCtrl.preRender) {
			const result = currCtrl.preRender(extra);
			if (result instanceof Promise) return result;
		}
	}
	return Promise.resolve();
}

function postRenderController(ctrlName: string): void {
	if (!ctrl[ctrlName]) return;
	const currCtrl = ctrl[ctrlName];
	if (currCtrl.postRender) currCtrl.postRender();
}

function closeControllers() {
	while (currentCtrls.length > 0) {
		const ctrl = currentCtrls.pop();
		if (ctrl.done) ctrl.done();
	}
}
