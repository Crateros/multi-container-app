const cors = require('cors');
const express = require('express');
const keys = require('./keys');
const redis = require('redis');
const { Pool } = require('pg');

// Express App Setup
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// Postgres Client Setup
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

// Create Values Table if it doesn't exist with column number as type INTEGER
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(`Table creation error: ${err}`));

// Redis Client Setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// Additional Redis Client to handle publishing
const redisPublisher = redisClient.duplicate();

// Express Route Handlers
// Basic get request
expressApp.get('/', (_, response) => {
    response.send('Hi');
});

// Get all values from postgres 'values' table
expressApp.get('/values/all', async (_, response) => {
    const values = await pgClient.query('SELECT * from values');
    console.log('VALUESSSSS: ', values.rows.map(value => value.number));
    response.send(values.rows.map(value => value.number));
});

// Get current values from Redis
expressApp.get('/values/current', async (_, response) => {
    redisClient.hgetall('values', (_, values) => {
        response.send(values);
    });
});

// Get value by index from Redis
expressApp.get('/values/:index', async (request, response) => {
    redisClient.hget('values', request.params.index, (_, value) => {
        response.send(value);
    });
});

// Send new values to backend and publish to Redis and postgres
expressApp.post('/values', async (request, response) => {
    const index = request.body.index;
    console.log('INDEX: ', index);

    // Do not attempt to calculate indexes over 40 due to performance constraints
    if (parseInt(index) > 40) {
        return response.status(422).send('Index too high, stack overflow!');
    }

    // Write index to redis
    redisClient.hset('values', index, 'Nothing yet!');
    // Send message to worker process for calculation
    redisPublisher.publish('insert', index);
    // Add new indes to postgres
    pgClient.query('INSERT into values(number) VALUES($1)', [index]);

    response.send({ working: true });
});

expressApp.listen(5000, () => console.log('Listening on port 5000, you idiot!'));