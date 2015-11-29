import templater from '../templater';

templater.registerController('user-edit', {
	preRender(id: string) {
		console.log('user-edit init:', id);
		const usr = templater.model.users[id];
		console.log('user:', usr);
	}
});