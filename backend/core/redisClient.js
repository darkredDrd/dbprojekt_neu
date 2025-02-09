import Redis from 'ioredis';

const redis = new Redis({
    host: 'localhost', // oder die URL Ihres Redis-Servers
    port: 6379, // Standardport für Redis
    // password: 'your_password', // falls erforderlich
});

export default redis;