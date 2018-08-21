const jira = {
        issues: require('./jira/issues'),
        sprint: require('./jira/sprint')
};
const github = require('./github');
const jenkins = require('./jenkins');

jira.issues().then((res) => console.log(res));
//jira.sprint().then((res) => console.log(res));
//github().then((res) => console.log(res));
//jenkins().then((res) => console.log(res));
