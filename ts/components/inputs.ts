import minion from '../minion';

minion.registerComponent('input-wide', {
	render(node: JQuery): void {
		const attrs: any = getInputAttrs(node);
		const template = `
			<div class="form-group">
				<label for="${attrs.name}" class="col-sm-3 control-label">${attrs.label}</label>
				<div class="col-sm-9">
					<input class="form-control" id="${attrs.name}" value="${attrs.value}" type="${attrs.type}">
				</div>
			</div>
		`;
		node.html(template);
	}
});

minion.registerComponent('input-narrow', {
	render(node: JQuery): void {
		const attrs: any = getInputAttrs(node);
		const template = `
			<div class="form-group">
				<label for="${attrs.name}">${attrs.label}</label>
				<input class="form-control" id="${attrs.name}" value="${attrs.value}" type="${attrs.type}">
			</div>
		`;
		node.html(template);
	}
});

function getInputAttrs(node: JQuery) {
	const attrs: any = getAttrs(node, 'name label value type'.split(' '));
	attrs.type = attrs.type || 'text';
	attrs.value = attrs.value || '';
	return attrs;
}

function getAttrs(node: JQuery, attrs: string[]) {
	const result = {};
	for (let attr of attrs) {
		result[attr] = node.attr(attr);
	}
	return result;
}