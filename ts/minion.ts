//-------------------- Exports --------------------

const minion = {
	rootModel: <any>{},	// Model
	showView,			// View
	controller,			// Controllers
	component,			// Components
	form2obj,			// Helper
	config: {			// Configuration
		templatePath: 'templates/'
	},
	showLoading,
	hideLoading
};

export default minion;

//-------------------- Module variables --------------------

const pageCache = {};
const ctrlRegistry = {};
const cmpRegistry = {};

//-------------------- Publics --------------------

function showView(page: string, target?: JQuery, extra?: string): Promise<JQuery> {
	console.log(`Showing view '${page}'`);
	minion.showLoading();
	target = target || $(`[mn-view=${page}]`);
	return showViewRecursive(page, target, minion.rootModel, extra)
	.then(viewContent => {
		minion.hideLoading();
		return viewContent;
	});
}

function controller(name: string, controller) {
	ctrlRegistry[name] = controller;
}

function component(name: string, component) {
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

function showViewRecursive(viewName: string, target: JQuery, parent, extra?: string): Promise<JQuery> {
	console.log(`  rendering template '${viewName}'`);
	const ctrl = ctrlRegistry[viewName] || {};
	ctrl.$parent = parent;
	return preRenderController(ctrl, extra)
	.then(() => {
		return getPage(viewName);
	})
	.then(pageData => {
		const renderCtx = getRenderContext(ctrl);
		const viewContent = $('<div>' + Mustache.render(pageData, renderCtx) + '</div>');
		return processSubviews(viewContent, ctrl, extra);
	})
	.then(viewContent => {
		target.empty().append(viewContent);
		processComponents(viewContent);
		registerEventHandlers(ctrl, viewContent, ['click', 'submit']);
		postRenderController(ctrl, viewContent);
		return viewContent;
	});
}

function processSubviews(viewContent: JQuery, parent, extra: string): Promise<JQuery> {
	const showPromises: Promise<JQuery>[] = [];
	viewContent.find('[mn-view]').each((i, e) => {
		const subView = $(e);
		showPromises.push(showViewRecursive(subView.attr('mn-view'), subView, parent, extra));
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
			$.get(minion.config.templatePath + page + '.html').done((pageData) => {
				pageCache[page] = pageData;
				Mustache.parse(pageData);
				resolve(pageData);
			});
		}
	});
}

function registerEventHandlers(ctrl, viewContent: JQuery, events: string[]) {
	for (var eventId of events) {
		var mnAttr = "mn-on" + eventId;
		viewContent.find("[" + mnAttr + "]").each((i, elem) => {
			const handlerName = $(elem).attr(mnAttr);
			if (ctrl[handlerName])
				$(elem).on(eventId, function() {
					return ctrl[handlerName]($(this));
				});
		});
	}
}

function showLoading() {
	console.log('Loading...');
}

function hideLoading() {
	console.log('...Done');
}

//---------- Controllers ----------

function preRenderController(ctrl, extra: string): Promise<any> {
	if (ctrl.preRender) {
		const result = ctrl.preRender(extra);
		if (result instanceof Promise) return result;
	}
	return Promise.resolve();
}

function postRenderController(ctrl, viewContent: JQuery): void {
	if (ctrl.postRender) ctrl.postRender(viewContent);
	if (ctrl.done) viewContent.bind('destroyed', () => {
		ctrl.done();
	});
}

function getRenderContext(ctrl) {
	const ctrls = [];
	while (ctrl) {
		ctrls.push(ctrl);
		ctrl = ctrl.$parent;	
	}
	return $.extend.apply(null, [{}].concat(ctrls.reverse()));
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
    remove: o => (o && o.handler) ? o.handler() : null
};