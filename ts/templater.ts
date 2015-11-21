const pageCache = {};
declare var ctrl;

class Templater {

	showPage(page: string, target: JQuery): void {
		console.log('Showing ' + page);
		this.getPage(page, (pageData) => {
			const viewContent = $('<div>' + pageData + '</div>');
			this.processSubviews(viewContent);
			target.empty().append(viewContent);
			this.initController(page);
		});
	}

	processSubviews(viewContent: JQuery) {
		viewContent.find('[fz-subview]').each((i, e) => {
			const subView = $(e);
			this.showPage(subView.attr('fz-subview'), subView);
		});
	}

	getPage(page: string, cb: (id: string) => void) {
		if (pageCache[page]) {
			cb(pageCache[page]);
		}
		else {
			$.get('templates/' + page + '.html').done((pageData) => {
				pageCache[page] = pageData;
				cb(pageData);
			});
		}
	}

	initController(page: string) {
		const ctrlName = this.dashed2camel(page);
		if (!ctrl[ctrlName]) return;	//TODO dynamically load controller
		ctrl[ctrlName].init();
	}

	dashed2camel(str: string) {
		const parts = str.split('-');
		let camel = parts[0];
		for (let i = 1; i < parts.length; i++) {
			camel += this.ucfirst(parts[i]);
		}
		return camel;
	}

	ucfirst(str: string) {
	    return str.charAt(0).toUpperCase() + str.slice(1);
	}
}

export default new Templater();
