var exports = module.exports = {};

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