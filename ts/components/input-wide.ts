import templater from '../templater';

templater.registerComponent('input-wide', {
	render(element: JQuery): string {
		//TODO use JSX, see http://www.jbrantly.com/typescript-and-jsx/
		return 'hello!';
	}
});
