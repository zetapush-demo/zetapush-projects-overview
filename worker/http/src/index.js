var github = require('./github');
var jenkins = require('./jenkins');

github().then((res) => console.log(res));
jenkins().then((res) => console.log(res));