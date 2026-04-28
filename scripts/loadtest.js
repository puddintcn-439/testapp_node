const autocannon = require('autocannon');

const url = process.argv[2] || 'http://localhost:3000';

autocannon({
  url,
  connections: 20,
  duration: 10
}, console.log);
