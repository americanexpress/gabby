# [Gabby](https://github.com/americanexpress/gabby) Examples
Currently the examples use the Watson Adapter.
 
### How to run:
1. Get credentials from Watson Conversation (you'll need to [sign up](https://www.ibm.com/watson/developercloud/conversation.html))
2. Take the credentials from the workspace and put them in `credentials.json` under examples directory, it should look like this:
```
  {
    "username": "xxx",
    "password": "xxx",
    "workspaceId": "xxx"
  }
```
3. Use the following commands to start the server:
```
cd /path/to/example
npm install
npm start
```