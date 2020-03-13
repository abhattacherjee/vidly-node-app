# vidly-node-app
Vidly app to demonstrate node.js functionality

Prerequisite: MongoDB running on localhost

Install MongoDB (MacOS)
```
$ brew tap mongodb/brew
$ brew install mongodb-community@4.2
```

Create MongoDB data folder
```
$ mkdir -p /usr/local/var/mongodb/data/db
```

Start MongoDB daemon service
```
$ mongod --dbpath /usr/local/var/mongdb
```

To run vidly app on port 3000
```
$ npm install
$ node index.js
```


