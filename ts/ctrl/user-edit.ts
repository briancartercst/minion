import templater from '../templater';

templater.registerController('user-edit', {
	init(id: string) {
		console.log('user-edit init:', id);
		const usr = templater.getModel().users[id];
		console.log('user:', usr);
	}
});