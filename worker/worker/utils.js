const fs = require('fs');
var exports = module.exports = {};

function get_substring(str, regex) {
	var tmp = str.split(regex);

	tmp.splice(-1, 1);
	return tmp.splice(-1, 1).join();
}

function check_bracket(str) {
	var tmp1 = str.indexOf('[');
	var tmp2 = str.indexOf(']');

	return tmp1 != -1 && tmp2 != -1 && tmp1 < tmp2;
}

exports.extract_data = function extract_data(src, keys) {
	var dest = {};

	for (var i = 0; i < keys.length; i++) {
		if (check_bracket(keys[i])) {
			var obj = keys[i].substring(0, keys[i].indexOf('['));
			var key = get_substring(keys[i], /[\[\]]/);

			dest[`${obj}`] = extract_data(src[`${obj}`], [key])[`${key}`];
		} else
			dest[`${keys[i]}`] = src[`${keys[i]}`];
	}
	return dest;
}

exports.obj_tab_filter = function obj_tab_filter(obj, accept) {
	var tab = [];

	obj.forEach(function(elem) {
		tab.push(Object.keys(elem)
			.filter(key => accept.includes(key))
			.reduce((tmp, key) => {
				tmp[key] = elem[key];
				return tmp;
			}, {})
		);
	});
	return (tab);
}

exports.parse_time = function parse_time(time) {
	var tmp = new Date(time);

	return (tmp.toString().split(' ').slice(0, -2).join(' '));
}

exports.get_good_color = function get_good_color(objtab) {
	for (var i = 0; i < objtab.length; i++)
		objtab[i].color = "#" + objtab[i].color;
	return (objtab);
}

exports.get_config = function get_config(data_field) {
        var data = fs.readFileSync('../.zetarc');

	data = JSON.parse(data);
	return data[`${data_field}`] || `'${data_field}' doesn't exist in '.zetarc'...`;
}