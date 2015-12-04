import minion from '../minion';

minion.component('input-wide', {
	render(node: JQuery, attrs): void {
		attrs = getInputAttrs(attrs);
		const template = `
			<div class="form-group">
				<label for="${attrs.name}" class="col-sm-3 control-label">${attrs.label}</label>
				<div class="col-sm-9">
					<input class="form-control" id="${attrs.name}" name="${attrs.name}"
						value="${attrs.value}" type="${attrs.type}">
				</div>
			</div>
		`;
		node.html(template);
	}
});

minion.component('input-narrow', {
	render(node: JQuery, attrs): void {
		attrs = getInputAttrs(attrs);
		const template = `
			<div class="form-group">
				<label for="${attrs.name}">${attrs.label}</label>
				<input class="form-control" id="${attrs.name}" name="${attrs.name}"
					value="${attrs.value}" type="${attrs.type}">
			</div>
		`;
		node.html(template);
	}
});


///--------------------------------------------------

function getInputAttrs(attrs) {
	attrs.type = attrs.type || 'text';
	attrs.value = attrs.value || '';
	return attrs;
}
