# A Microsoft Bot Framework & IBM Watson Bot sample

A sample bot using Microsoft Bot framework as communication channel support and IBM Watson Conversation

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/vperrinfr/Cortana-Watson)

## Introduction

The Microsoft Bot Framework provides just what you need to build and connect intelligent bots that interact naturally wherever your users are talking, from text/sms to Skype, Slack, Office 365 mail and other popular services. [More details](https://dev.botframework.com/)

IBM Watson Conversation service help you to quickly build and deploy chatbots and virtual agents across a variety of channels, including mobile devices, messaging platforms, and even robots. [More details](https://www.ibm.com/watson/services/conversation/)

Why using Microsoft Bot Framework & IBM Watson : **Openess**
- Watson Conversation is channel-agnostic. IBM provided native integration with Slack and integration with [BotKit](https://www.botkit.ai/).
- Microsoft Bot Framework opens Watson to the Microsoft world via its integration with Skype, Bing, Cortana, Office365 Mail, Microsoft Teams...https://docs.microsoft.com/en-us/bot-framework/portal-configure-channels

## Prerequisites

The minimum prerequisites to run this sample are:
* Create a Bluemix account & a Watson Conversation Workspace
    * In case, you don't have it : [Sign up](https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson) in Bluemix, or use an existing account and follow the instruction of that sample for the [Watson Conversation](https://github.com/watson-developer-cloud/conversation-simple) design.
    
* Latest Node.js with NPM. Download it from [here](https://nodejs.org/en/download/).
* The [Cloud Foundry][cloud_foundry] command-line client

      Note: Ensure that you Cloud Foundry version is up to date
* The Bot Framework Emulator. To install the Bot Framework Emulator, download it from [here](https://emulator.botframework.com/). Please refer to [this documentation article](https://github.com/microsoft/botframework-emulator/wiki/Getting-Started) to know more about the Bot Framework Emulator.
* Register your bot with the Microsoft Bot Framework. Please refer to [this](https://docs.microsoft.com/en-us/bot-framework/portal-register-bot) for the instructions. Once you complete the registration, update your bot configuration with the registered config values (See [Debugging locally using ngrok](https://docs.microsoft.com/en-us/bot-framework/debug-bots-emulator) or [Deploying to IBM Bluemix](https://console.bluemix.net/docs/runtimes/nodejs/getting-started.html#getting-started-with-node-js-on-bluemix)

## Results

Channels supported by Bot Framework
![Channels](readme_images/channels.png)

My bot tested with Bot Framework test client
![Test Client in Bot Framework](readme_images/test.png)

My conversation with Watson via Microsoft Skype
![Skype](readme_images/skype.png)

## More Information

To get more information about how to get started, please review the following resources:
* [IBM Bluemix](https://www.ibm.com/cloud-computing/bluemix/)
* [Watson Developer Cloud](https://www.ibm.com/watson/developer/)
* [Watson Conversation](https://www.ibm.com/watson/services/conversation/)
* [Microsoft Bot Builder for Node.js Reference](https://docs.microsoft.com/en-us/bot-framework/nodejs/)
* [Bot Framework FAQ](https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq#i-have-a-communication-channel-id-like-to-be-configurable-with-bot-framework-can-i-work-with-microsoft-to-do-that)

