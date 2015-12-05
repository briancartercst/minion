//-------------------- Exports & interfaces --------------------

const minion = {
	render,
	component,
	form2obj,
	config: {
		templatePath: 'templates/'
	},
	showLoading,
	hideLoading
};

export default minion;

//-------------------- Module variables --------------------

const templates = {};	// Template cache
const components = {};	// Component registry

//-------------------- Publics --------------------

function render(tagName: string, node: JQuery): Promise<JQuery> {
	minion.showLoading();
	return renderRecursive(tagName, node)
	.then(viewContent => {
		minion.hideLoading();
		return viewContent;
	});
}

function component(name: string, component) {
	components[name] = component;
}

function showLoading() {
	console.log('Loading...');
}

function hideLoading() {
	console.log('...Loaded');
}

function form2obj(form: JQuery): Object {
	var result = {};
	for (const input of form.serializeArray()) {
		if (input.value)
			result[input.name] = Mustache.escape(input.value);
		const inputType = form.find(`:input[name=${input.name}]`).attr('type');
		if (inputType == 'number')
			result[input.name] = parseFloat(input.value);
		else if (inputType == 'checkbox')
			result[input.name] = true;
	}
	return result;
}

//-------------------- Privates --------------------

function renderRecursive(tagName: string, target: JQuery): Promise<JQuery> {
	const component = getComponent(tagName);
	return (component.init(target) || Promise.resolve())
	.then(() => {
		return getTemplate(tagName, component);
	})
	.then(template => {
		const node = $('<div>' + Mustache.render(template, component) + '</div>');
		return renderSubcomponents(node);
	})
	.then(node => {
		target.empty().append(node);
		registerEventHandlers(component, node);
		component.ready(node);
		if (component.done) node.bind('destroyed', component.done);
		return node;
	});
}

function getComponent(tagName: string) {
	const compDef = components[tagName] || {};
	const component = (compDef instanceof Function) ? new compDef() : $.extend({}, compDef);
	component.init = component.init || function(){};
	component.ready = component.ready || function(){};
	return component;
}

function getTemplate(tagName: string, component): Promise<string> {
	return new Promise(resolve => {
		if (templates[tagName])
			resolve(templates[tagName]);
		else
			return getTemplateFromComponent(tagName, component)
			.then((pageData) => {
				Mustache.parse(pageData);
				if (!component.dynamic) templates[tagName] = pageData;
				resolve(pageData);
			});
	});
}

function getTemplateFromComponent(tagName: string, component): Promise<string> {
	return new Promise(resolve => {
		if (component.template) return resolve(component.template);
		const templateUrl = component.templateUrl || tagName;
		$.get(minion.config.templatePath + templateUrl + '.html')
		.done(pageData => resolve(pageData));
	});
}

function registerEventHandlers(component, node: JQuery) {
	for (var eventId of ['click', 'submit']) {
		var mnAttr = "mn-" + eventId;
		node.find("[" + mnAttr + "]").each((i, elem) => {
			const handlerName = $(elem).attr(mnAttr);
			if (component[handlerName])
				$(elem).on(eventId, function() {
					return component[handlerName]($(this));
				});
		});
	}
}

function renderSubcomponents(node: JQuery): Promise<JQuery> {
	const promises: Promise<JQuery>[] = [];
	node.find(getComponentsQuery()).each((i, e) => {
		promises.push(renderRecursive(e.localName, $(e)));
	});
	return Promise.all(promises).then(() => node);
}

function getComponentsQuery(): string {
	const compTags = [];
	for (const tag in components)
		if (components.hasOwnProperty(tag)) compTags.push(tag);
	return compTags.join(',');
}

//--------------- Setup  ---------------

$['event'].special.destroyed = {
    remove: o => (o && o.handler) ? o.handler() : null
};

const viewCache = {};

component('mn-view', class {
	template: string;
	dynamic = true;

	init(node: JQuery) {
		return new Promise(resolve => {
			const viewName = node.attr('template');
			if (viewCache[viewName]) {
				this.template = viewCache[viewName];
				resolve();
			}
			else {
				$.get(minion.config.templatePath + viewName + '.html')
				.done(pageData => {
					this.template = pageData;
					viewCache[viewName] = pageData;
					resolve();
				});
			}
		});
	}
});