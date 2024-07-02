const axios = require('axios');
const { cacheClient } = require('../../utils/redis-connection');
const { url: { codeforces_base_url }, rateLimitConfig } = require('../../config/development.config.json');

async function getCacheData({ url = "" }) {
    try {
        const cacheKey = url;
        const cachedResponse = await cacheClient.get(cacheKey);
        if (cachedResponse) {
            await cacheClient.expire(cacheKey, rateLimitConfig.CACHE_DURATION);
            return { cachedResponse };
        }
        return { cachedResponse: null };
    } catch (err) {
        console.error('Redis get error:', err);
        throw { status: 500, message: 'Internal Server Error' };
    }
}

async function setCacheData({ url = "", data = {} }) {
    try {
        const cacheKey = url;
        await cacheClient.set(cacheKey, JSON.stringify(data));
        await cacheClient.expire(cacheKey, rateLimitConfig.CACHE_DURATION);
    } catch (err) {
        console.error('Redis set error:', err);
        throw { status: 500, message: 'Internal Server Error' };
    }
}

async function getCodeforcesBlogFromExternalAPI({ blogEntryId = ""}) {
    try {
        const response = await axios.get(`${codeforces_base_url}/api/blogEntry.view`, {
            params: { blogEntryId },
        });
        console.log(response.data.result);
        if (!response || !response.data || !response.data.result) {
            throw { status: 404, message: 'Blog entry not found' };
        }
        return { blogData: response.data };
    } catch (error) {
        console.error('Error in fetching data from external API:', error);
        throw error;
    }
}


async function getCodeforcesBlogData ({ url, blogEntryId }) {
    const { cachedResponse: cacheData } = await getCacheData({ url });
    if (cacheData !== null) {
        return { blogData: JSON.parse(cacheData) };
    }
    const { blogData } = await getCodeforcesBlogFromExternalAPI({ blogEntryId });
    await setCacheData({ url, data: blogData });
    return { blogData };
}

module.exports = { getCodeforcesBlogData };