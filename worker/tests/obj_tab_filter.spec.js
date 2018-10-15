const { obj_tab_filter } = require('../worker/utils.js')

describe('obj_tab_filter', () => {
	const input = [
		{
			str: 'mdr',
			nb: 10.5
		},
		{
			str: 'lol',
			nb: 21
		},
		{
			str: 'ptdr',
			nb: 42
		}
	];

	it(': basic valid unique value', () => {
		const res = obj_tab_filter(input, ['str']);
		const expected = [
			{
				str: 'mdr',
			},
			{
				str: 'lol',
			},
			{
				str: 'ptdr',
			}
		];

	       expect(res).toEqual(expected);
	});

	it(': accept all input key', () => {
		const res = obj_tab_filter(input, ['str', 'nb']);

		expect(res).toEqual(input);
	});

	it(': accept array, empty string', () => {
		const res = obj_tab_filter(input, ['', '']);

		expect(res).toEqual(null);
	});

	it(': empty, accept array', () => {
		const res = obj_tab_filter(input, []);

		expect(res).toEqual(null);
	});

	it(': empty input', () => {
		const res = obj_tab_filter([], ['str']);

		expect(res).toEqual([]);
	});
});
