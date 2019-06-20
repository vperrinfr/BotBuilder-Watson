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

// storageKey and storageURL are required psrameters in the environment
var storageKey=process.env.storageKey;
if (storageKey) {
  console.log("process.env.storageKey "+ process.env.storageKey); 
} else {
  console.error('storageKey must be specified in environment');
  process.exit(1);
}
var storageURL=process.env.storageURL;
if (storageURL) {
  console.log("process.env.storageURL "+ process.env.storageURL); 
} else {
  console.error('storageURL must be specified in environment');
  process.exit(1);
}

var documentDbOptions = {
  host: storageURL, 
  masterKey: storageKey, 
  database: 'botdocs',   
  collection: 'botdata'
};

var contexts= [];
var docDbClient = new azure.DocumentDbClient(documentDbOptions);
var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create the service wrapper
var workspace = process.env.WORKSPACE_ID || '';
var conv_url = process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/assistant/api/';

var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  url: conv_url,
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
    console.log("conversation ID "+ session.message.address.conversation.id);
    console.log("Message detail:\n"+JSON.stringify(session.message, null, 2));

    if (2048<session.message.text.length) {
      console.warn('Message length is too long '+session.message.text.length+' truncate to 2048');
      session.message.text = session.message.text.substring(0, 2047)
    }

    var regex = /[\t\n\r]/g
    if (null != (bad_chars = session.message.text.match(regex))) {
      console.warn('Input contans bad characters', bad_chars);
      session.message.text = session.message.text.replace(regex, " ");
    // } else {
    //   console.log('No illegal characters in the input: '+session.message.text);
    }

    var payload = {
        workspace_id: workspace,
        context:'',
        input: { text: session.message.text}
    };

    // If the user asked us to start over create a new context
    if ((session.message.text.toLowerCase() == 'start over') || (session.message.text.toLowerCase() == 'start_over')) {
      var convId = ession.message.address.conversation.id;
      console.log('Starting a new Conversation for '+convId);
      if (contexts[convId]) 
        delete contexts[convId];
    }
  
    var conversationContext = findOrCreateContext(session.message.address.conversation.id);	
    if (!conversationContext) conversationContext = {};
    payload.context = conversationContext.watsonContext;

    conversation.message(payload, function(err, response) {
     if (err) {
      console.error(err);
      session.send("ERROR: "+err.message);
     } else {
       console.log("Response:\n"+JSON.stringify(response, null, 2));
       response.output.text.forEach(function(line) {
         console.log('Sending: '+line);
         session.send(line);
       });
      //  session.send(response.output.text);
       conversationContext.watsonContext = response.context;
     }
    });

}).set('storage', cosmosStorage);

function findOrCreateContext (convId){
      // Let's see if we already have a session for the user convId
    if (!contexts[convId]) {
        // No session found for user convId, let's create a new one
        contexts[convId] = {workspaceId: workspace, watsonContext: {'client_type': 'MS_Teams'}};
        console.log('Creating a new context structure for conversation '+ convId);
    } else {
      console.log("Reusing Context:\n"+JSON.stringify(contexts[convId], null, 2));
    }
return contexts[convId];
}

server.get(/\/?.*/, restify.plugins.serveStatic({
  directory: './images',
  default: 'Picture1.png'
}))
