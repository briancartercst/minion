import minion from '../minion';

interface ToDoItem {
	text: string,
	done: boolean
}

minion.component('todo', class {
	todoList: ToDoItem[] = [];

	keyPressed(elem, evt) {
		if (evt.keyCode != 13 || elem.val().length == 0) return;
		const item = { text: elem.val(), done: false };
		this.todoList.push(item);
		this.addTodoComponent(item);
		elem.val('');
	}

	addTodoComponent(item) {
		const node = $('<todo-item>');
		$('.todo-list').append(node);
		minion.render('todo-item', node, { item }, 'item')
		.then(node => {
			const itemComp = node.data('component');
			itemComp.deleteItem = (elem) => this.deleteItem(node, itemComp.item);
		});
	}

	deleteItem(node: JQuery, item: ToDoItem) {
		this.todoList.splice(this.todoList.indexOf(item), 1);
		node.remove();
	}

	deleteCompleted() {
		$('todo-item').each((i, e) => {
			const node = $(e);
			const itemComp = node.data('component');
			if (itemComp.item.done)
				this.deleteItem(node, itemComp.item);
		});
	}
});

minion.component('todo-item', class {
	template = `
		<div style="padding: 1em; border-bottom: 1px solid #CCC">
			<input type="checkbox" mn-click="toggleDone">&nbsp;&nbsp;
			<span class="item-text">{{item.text}}<span>
			<button class="btn btn-danger btn-sm pull-right" style="margin-top: -0.5ex"
				type="button" mn-click="deleteItem">
				<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
			</button>
		</div>
	`;

	item: ToDoItem;
	itemText: JQuery;

	ready(node) {
		this.itemText = node.find('.item-text');
	}

	deleteItem(elem) {}

	toggleDone() {
		this.item.done = !this.item.done;
		this.itemText.toggleClass('todo-done');
	}
});