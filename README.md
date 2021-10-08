# nestjs-ncc-bytenode
Minimal repo to test nestjs-ncc-bytenode combination compiled code running

# Note
Project uses the sqlite3 and the code compiled and tested on Win10 64Bit env.
If running on the other platform pleaes configure and install the node-gyp

Node-Gyp: https://www.npmjs.com/package/node-gyp

# With a successful running of the server
After a successfull run, the console will display the following message:
Server started running on http://localhost:3000

While running the server, following api can access for the CURD operations:

http://localhost:3000/api/posts

# Compile
$ npm run build - (build the nestjs application)
$ npm run ncc - (compile the nestjs application to a single js)
$ npm run bytenode - (compile the js file to bytecode)

# Runing application
$ npm run start:dev - (run the nestjs application for development)
$ node ncc/index.js - (run the ingle compile js in nodejs)
$ npm run byterun - (run the compiled bytecode)


