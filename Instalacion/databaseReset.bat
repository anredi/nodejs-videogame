@echo off
"C:/Program Files/MongoDB/Server/3.4/bin/mongo.exe" -u "antonio" -p "password" --authenticationDatabase "webgamedb" < DatabaseReset.js