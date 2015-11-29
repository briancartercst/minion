import templater from '../templater';

templater.registerComponent('input-wide', {
	render(element: JQuery): string {
		return 'hello!';
	}
});