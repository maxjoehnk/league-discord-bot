const api = require('league-api');

const db = api.db.connect();

const migrate = async connection => {
    await api.db.migrate(connection);
};

module.exports = {
    db,
    migrate
};
