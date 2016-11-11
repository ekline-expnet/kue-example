Example of how to use node kue with express and a worker
spawned by the express server

Install instructions:
- Install Redis (osx homebrew: brew install redis)
- Configure redix (edit /usr/loca/etc/redis.conf)
  - If homebrew, need to edit config and search for "bind".
    Config has 2 entries which cause conflict..

    Limit access by setting bind to 127.0.0.1
- Test Redis: redis-cli ping (should respond with pong)
- Run npm install to install dependencies
- Run: node server.js
- Open browser to http://localhost:3000/
- Hit the button and watch the status updates roll... hit again while
  job is working and see that the other job is on hold
