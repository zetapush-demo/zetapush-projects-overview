var jira = require('./jira/issues');
var github = require('./github');
var jenkins = require('./jenkins');

jira().then((res) => console.log(res));
//github().then((res) => console.log(res));
//jenkins().then((res) => console.log(res));
