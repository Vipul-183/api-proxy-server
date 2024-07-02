const redis = require('redis');

const cacheClient = redis.createClient();
cacheClient.connect();

cacheClient.on('connect',() => {
    console.log('Redis Client Connected');
});

cacheClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});


module.exports = { cacheClient };