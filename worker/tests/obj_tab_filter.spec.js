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
});
