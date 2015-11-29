import templater from '../templater';

templater.registerController('user-edit', {
	preRender(id: string) {
		templater.model.user = templater.model.users[id];
	}
});