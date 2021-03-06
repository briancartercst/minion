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

function render(tagName: string, node: JQuery, model?, bindProp?): Promise<JQuery> {
	model = model || {};
	minion.showLoading();
	return renderRecursive(tagName, node, model, bindProp)
	.then(node => {
		minion.hideLoading();
		return node.parent();
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

function form2obj(form: JQuery, dest?): Object {
	var result = dest || {};
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

function renderRecursive(tagName: string, target: JQuery, parent, bindProp?): Promise<JQuery> {
	const component = getComponent(tagName);
	target.data('component', component);
	bindComponent(component, bindProp || target.attr('bind'), parent);
	return (component.init(target) || Promise.resolve())
	.then(() => {
		return getTemplate(tagName, component);
	})
	.then(template => {
		const node = $('<div>' + Mustache.render(template, component) + '</div>');
		return renderSubcomponents(node, component);
	})
	.then(node => {
		target.empty().append(node);
		registerEventHandlers(component, node);
		component.ready(node);
		if (component.done) node.bind('destroyed', () => component.done(node));
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

function bindComponent(component, binds, parent) {
	if (!binds) return;
	for (var bindExpr of binds.split(',')) {
		bindExpr = bindExpr.trim();
		let bindFrom, bindTo;
		const match = /(\S+)\s+as\s+(\S+)/.exec(bindExpr);
		if (match) {
			bindFrom = match[1];
			bindTo = match[2];
		}
		else {
			bindFrom = bindExpr;
			bindTo = bindExpr;
		}
		const value = getNestedProp(parent, bindFrom);
		if (bindTo == '*') $.extend(component, value);
		else component[bindTo] = value;
	}
}

function getNestedProp(obj, prop) {
	if (prop == '*') {
		const keys = Object.keys(obj).filter(
			prop => !(obj[prop] instanceof Function) && prop != 'template' && prop != 'templateUrl'
		);
		const result = {};
		for (const key of keys) result[key] = obj[key];
		return result;
	}
	if (prop.indexOf('.') < 0) return obj[prop];
	let value = obj;
	for (const p of prop.split('.')) value = value[p];
	return value;
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
		var mnAttr = 'mn-' + eventId;
		node.find('[' + mnAttr + ']').each((i, elem) =>
			registerEventHandler(component, $(elem), eventId, $(elem).attr(mnAttr))
		);
	}
	node.find('[mn-event]').each((i, elem) => {
		const match = /(\S+)\s+=>\s+(\S+)/.exec($(elem).attr('mn-event'));
		if (match) registerEventHandler(component, $(elem), match[1], match[2]);
	});
}

function registerEventHandler(component, elem, eventId, handlerName) {
	if (component[handlerName])
		$(elem).on(eventId, function(event) {
			return component[handlerName]($(this), event);
		});
}

function renderSubcomponents(node: JQuery, parent): Promise<JQuery> {
	const promises: Promise<JQuery>[] = [];
	node.find(getComponentsQuery()).each((i, e) => {
		promises.push(renderRecursive(e.localName, $(e), parent));
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