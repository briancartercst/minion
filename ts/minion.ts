//-------------------- Exports --------------------

const model = <any>{};

export default {
	model,				// Model
	showView,			// View
	registerController,	// Controllers
	registerComponent,	// Components
	form2obj			// Helper
}


//-------------------- Module variables --------------------

const pageCache = {};
const ctrlRegistry = {};
const cmpRegistry = {};

//-------------------- Publics --------------------

function showView(page: string, target: JQuery, extra?: string): Promise<JQuery> {
	console.log(`Showing view '${page}'`);
	return showViewRecursive(page, target, extra);
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

function showViewRecursive(viewName: string, target: JQuery, extra?: string): Promise<JQuery> {
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
		registerEventHandlers(viewName, viewContent, ['click', 'submit']);
		postRenderController(viewName, viewContent);
		return viewContent;
	});
}

function processSubviews(viewContent: JQuery, extra: string): Promise<JQuery> {
	const showPromises: Promise<JQuery>[] = [];
	viewContent.find('[mn-view]').each((i, e) => {
		const subView = $(e);
		showPromises.push(showViewRecursive(subView.attr('mn-view'), subView, extra));
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

function registerEventHandlers(viewName: string, viewContent: JQuery, events: string[]) {
	const ctrl = ctrlRegistry[viewName];
	if (!ctrl) return; 
	for (var eventId of events) {
		var mnAttr = "mn-on" + eventId;
		viewContent.find("[" + mnAttr + "]").each((i, elem) => {
			const evtHandler = $(elem).attr(mnAttr);
			if (!ctrl.evtHandler) console.warn(
				`Event handler '${evtHandler}' not found in controller for view '${viewName}'`);
			else $(elem).on(eventId, ctrl.evtHandler);
		});
	}
}

//---------- Controllers ----------

function preRenderController(ctrlName: string, extra: string): Promise<any> {
	const ctrl = ctrlRegistry[ctrlName]; 
	if (ctrl) {
		ctrl.$name = ctrlName;
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
	registerCloseHandler(viewContent, ctrl);
}

function registerCloseHandler(viewContent: JQuery, ctrl) {
	if (!ctrl.done) return;
	viewContent.bind('destroyed', () => {
		ctrl.done();
	});
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

//--------------- Startup  ---------------

$['event'].special.destroyed = {
    remove: function(o) {
		if (o && o.handler) {
			o.handler();
		}
    }
};