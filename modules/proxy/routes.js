const experess = require('express');
const router = experess.Router();
const { validateRateLimit } = require('./middleware');
const { getCodeforcesBlog } = require('./controller');

router.get('/codeforces', validateRateLimit, getCodeforcesBlog);

module.exports = {
    router
};