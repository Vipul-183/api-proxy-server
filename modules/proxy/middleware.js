const { cacheClient } = require('../../utils/redis-connection');
const { rateLimitConfig } = require('../../config/development.config.json');

async function validateRateLimit(req, res, next) {
    try {
        const { ip } = req;
        const now = Date.now();
        const rateLimitString = await cacheClient.get(ip);
        let rateLimit = JSON.parse(rateLimitString) || [];
        rateLimit = rateLimit.filter(timestamp => now - timestamp < rateLimitConfig.RATE_LIMIT_WINDOW);
        if (rateLimit.length >= rateLimitConfig.RATE_LIMIT) {
            throw {status: 429, message: 'Rate limit exceeded'};
        }
        rateLimit.push(now);
        await cacheClient.set(ip, JSON.stringify(rateLimit));
        next();
    } catch (err) {
        const { status = 500, message = 'Internal Server Error'} = err;
        return res.status(status).json({ error: message });
    }
}

module.exports = { validateRateLimit };