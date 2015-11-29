import minion from '../minion';

minion.registerController('user-edit', {
	preRender(id: string) {
		minion.model.user = minion.model.users[id];
	}
});