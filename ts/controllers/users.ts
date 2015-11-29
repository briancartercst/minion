import minion from '../minion';

minion.registerController('users', {
	preRender() {
		return getData().then(users => {
			minion.model.users = users;
		});
	}
});

//-------------------- Private --------------------

interface User {
	name: string,
	surname: string,
	email: string,
	mobile: string,
	id: number
}

function getData(): Promise<User[]> {
	const data: User[] = [];
	for (let i = 0; i < 10; i++)
		data.push(createUser(i));
	return Promise.resolve(data);
}

function createUser(id: number): User {
	const usr: User = <any>{};
	usr.name = randomName(3, 6);
	usr.surname = randomName(4, 7);
	usr.email = usr.name + '.' + usr.surname + '@gmail.com';
	usr.mobile = randomMobile();
	usr.id = id;
	return usr;
}

const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';

function randomName(min: number, max: number): string {
	let name: string = '';
	let letters: string;
	const len = randomNum(min, max);
	for (let i = 0; i < len; i++) {
		letters = (i % 2 == 0) ? CONSONANTS : VOWELS;
		name += letters[randomNum(0, letters.length)];
		if (name.length == 1) name = name.toUpperCase();
	}
	return name;
}

function randomMobile(): string {
	let num: string = '6';
	for (let i = 1; i < 9; i++) {
		if (i % 3 == 0) num += ' ';
		num += randomNum(0, 10);
	}
	return num;
}

function randomNum(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min));
}

