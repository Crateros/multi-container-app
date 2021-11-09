const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const subscriber = redisClient.duplicate();
console.log('IN THE WORKER!')

// Recursive Fibonnaci function, which is slow but illustrates
// the concept of a worker process running asynchronously
const fib = (index) => {
    console.log('Calculating fibonacci for index:', index);
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
};

subscriber.on('message', (channel, message) => {
    // Parse the message as an integer and add it to hash table in redis
    // called 'values'
    redisClient.hset('values', message, fib(parseInt(message)));
});

subscriber.subscribe('insert');