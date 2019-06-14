/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var restify = require('restify');
var builder = require('botbuilder');
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

require('dotenv').config({silent: true});

// set up Azure storegae for the bot
var azure = require('botbuilder-azure'); 
var documentDbOptions = {
  host: 'https://coca-cola.documents.azure.com:443/', 
  masterKey: '1mn4CMC9KYTRg7Fgtw1X21JJu64MoqRbGgauGTiebyzspWSR12C993rk07w9LVg6o8BPlLS9JWH4Ro4x7Dkb0g==', 
  database: 'botdocs',   
  collection: 'botdata'
};

var docDbClient = new azure.DocumentDbClient(documentDbOptions);

var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create the service wrapper
var workspace=process.env.WORKSPACE_ID || '';
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: Conversation.VERSION_DATE_2017_04_21
});
console.log("process.env.WORKSPACE_ID "+ process.env.WORKSPACE_ID); 
console.log("process.env.appID "+ process.env.appId); 
console.log("process.env.appPassword "+ process.env.appPassword); 

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.appId,
    appPassword: process.env.appPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    console.log("ID client "+ session.message.address.conversation.id);
    console.log(JSON.stringify(session.message, null, 2));

    var payload = {
        workspace_id: workspace,
        context:'',
        input: { text: session.message.text}
    };

    var conversationContext = findOrCreateContext(session.message.address.conversation.id);	
    if (!conversationContext) conversationContext = {};
    payload.context = conversationContext.watsonContext;

    conversation.message(payload, function(err, response) {
     if (err) {
       session.send(err);
     } else {
       console.log(JSON.stringify(response, null, 2));
       session.send(response.output.text);
       conversationContext.watsonContext = response.context;
     }
    });

}).set('storage', cosmosStorage);

var contexts;
function findOrCreateContext (convId){
      // Let's see if we already have a session for the user convId
    if (!contexts)
        contexts = [];
        
    if (!contexts[convId]) {
        // No session found for user convId, let's create a new one
        contexts[convId] = {workspaceId: workspace, watsonContext: {}};
        console.log ("new session : " + convId);
    }
return contexts[convId];
}

server.get(/\/?.*/, restify.plugins.serveStatic({
  directory: './images',
  default: 'Picture1.png'
}))
