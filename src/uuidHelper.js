const uuidv4 = require('./uuid/v4');

const getUUID = function(){
	return uuidv4();
}

module.exports = { getUUID : getUUID };