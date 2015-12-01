//-------------------- Exports --------------------

const model = <any>{};

export default {
	model,				// Model
	showPage,			// View
	showView,
	registerController,	// Controllers
	registerComponent,	// Components
	form2obj			// Helper
}


//-------------------- Module variables --------------------

const pageCache = {};
const ctrlRegistry = {};
const cmpRegistry = {};
const currentCtrls = [];

//-------------------- Publics --------------------

function showPage(page: string, target: JQuery, extra?: string): void {
	console.log(`Showing page '${page}'`);
	closeControllers();
	showView(page, target, extra);
}

function showView(viewName: string, target: JQuery, extra?: string): Promise<JQuery> {
	console.log(`  rendering template '${viewName}'`);
	return preRenderController(viewName, extra)
	.then(() => {
		return getPage(viewName);
	})
	.then(pageData => {
		const viewContent = $('<div>' + Mustache.render(pageData, model) + '</div>');
		return processSubviews(viewContent, extra);
	})
	.then(viewContent => {
		target.empty().append(viewContent);
		processComponents(viewContent);
		postRenderController(viewName, viewContent);
		return viewContent;
	});
}

function registerController(name: string, controller) {
	ctrlRegistry[name] = controller;
}

function registerComponent(name: string, component) {
	cmpRegistry[name] = component;
}

function form2obj(form: JQuery): Object {
	var result = {};
	for (const input of form.serializeArray()) {
		if (input.value)
			result[input.name] = input.value;
		const inputType = form.find(`:input[name=${input.name}]`).attr('type');
		if (inputType == 'number')
			result[input.name] = parseFloat(input.value);
		else if (inputType == 'checkbox')
			result[input.name] = true;
	}
	return result;
}


//-------------------- Privates --------------------

function processSubviews(viewContent: JQuery, extra: string): Promise<JQuery> {
	const showPromises: Promise<JQuery>[] = [];
	viewContent.find('[mn-view]').each((i, e) => {
		const subView = $(e);
		showPromises.push(showView(subView.attr('mn-view'), subView, extra));
	});
	return Promise.all(showPromises).then(results => {
		return viewContent;
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

//---------- Controllers ----------

function preRenderController(ctrlName: string, extra: string): Promise<any> {
	const ctrl = ctrlRegistry[ctrlName]; 
	if (ctrl) {
		ctrl.$name = ctrlName;
		currentCtrls.push(ctrl);
		// Call prerender
		if (ctrl.preRender) {
			const result = ctrl.preRender(extra);
			if (result instanceof Promise) return result;
		}
	}
	return Promise.resolve();
}

function postRenderController(ctrlName: string, viewContent: JQuery): void {
	const ctrl = ctrlRegistry[ctrlName]; 
	if (!ctrl) return;
	if (ctrl.postRender) ctrl.postRender(viewContent);
}

function closeControllers() {
	while (currentCtrls.length > 0) {
		const ctrl = currentCtrls.pop();
		if (ctrl.done) ctrl.done();
	}
}

//---------- Components ----------

function processComponents(viewContent: JQuery) {
	viewContent.find('[mn-component]').each((i, e) => {
		processComponent($(e));
	});
}

function processComponent(node: JQuery) {
	const compName = node.attr('mn-component');
	const component = cmpRegistry[compName];
	if (!component) {
		console.warn(`Component ${compName} not found`);
		return;
	}
	component.render(node);
}