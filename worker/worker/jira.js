var axios = require('axios');

var config = {
	headers: {
		Authorization: 'Basic ZGFtaWVuQHpldGFwdXNoLmNvbTpqNktzVFl0dHdud2l1WWJRb0NEV0E1NUY=',
	}
};

module.exports = async function()
{
	var res = await axios.get('https://zetapush.atlassian.net/rest/api/2/project/', config)

	return res.data;
}