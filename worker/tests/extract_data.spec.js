const { extract_data } = require('../utils');

describe('extract_data', () => {
	const input = {
		key1: 'mdr',
		key2: {
			name: 'chien',
			age: 42
		}
	};

	it(': basic valid 1', () => {
		const res = extract_data(input, ['key2']);
		const expected = {
			key2: {
				name: 'chien',
				age: 42
			}
		};

	       expect(res).toEqual(expected);
	});

	it(': complex valid 1', () => {
		const res = extract_data(input, ['key1', 'key2[name]']);
		const expected = {
			key1: 'mdr',
			key2: 'chien'
		};

		expect(res).toEqual(expected);
	});

	it(': complex valid 2', () => {
		const res = extract_data(input, ['key1', 'key2[age]']);
		const expected = {
			key1: 'mdr',
			key2: 42
		};

		expect(res).toEqual(expected);
	});

	it(': basic bad parameter', () => {
		const res = extract_data(input, ['key1', 'ptdr']);
		const expected = {
			key1: 'mdr'
		};

		expect(res).toEqual(expected);
	});

	it(': basic empty parameter', () => {
		const res = extract_data(input, ['', '']);
		const expected = {};

		expect(res).toEqual(expected);
	});

	it(': basic second null parameters', () => {
		const res = extract_data(input, [null, null]);
		const expected = {};

		expect(res).toEqual(expected);
	});

	it(': basic first null parameters', () => {
		const res = extract_data(null, ['key1', 'key2']);
		const expected = null;

		expect(res).toEqual(expected);
	});
});
