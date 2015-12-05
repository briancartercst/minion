import minion from '../minion';

minion.component('input-wide', class {
	attrs: any;
	template = `
		<div class="form-group">
			<label for="{{attrs.name}}" class="col-sm-3 control-label">{{attrs.label}}</label>
			<div class="col-sm-9">
				<input class="form-control" id="{{attrs.name}}" name="{{attrs.name}}"
					value="{{attrs.value}}" type="{{attrs.type}}">
			</div>
		</div>
	`;
	init(node: JQuery) {
		this.attrs = getInputAttrs(node);
	}
});

minion.component('input-narrow', class {
	attrs: any;
	template = `
		<div class="form-group">
			<label for="{{attrs.name}}">{{attrs.label}}</label>
			<input class="form-control" id="{{attrs.name}}" name="{{attrs.name}}"
				value="{{attrs.value}}" type="{{attrs.type}}">
		</div>
	`;
	init(node: JQuery) {
		this.attrs = getInputAttrs(node);
	}
});


///--------------------------------------------------

function getInputAttrs(node) {
	const attrs = <any>{};
	for (let attr of 'name label value type'.split(' '))
		attrs[attr] = node.attr(attr);
	attrs.type = attrs.type || 'text';
	attrs.value = attrs.value || '';
	return attrs;
}
