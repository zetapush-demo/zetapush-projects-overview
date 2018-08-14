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
	var split = time.split("T");

	return (split[0] + " " + split[1].slice(0, -1));
}

exports.get_good_color = function get_good_color(objtab) {
	for (var i = 0; i < objtab.length; i++)
		objtab[i].color = "#" + objtab[i].color;
	return (objtab);
}