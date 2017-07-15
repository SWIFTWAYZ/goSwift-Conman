# goSwift-Conman

goSwift's connection request manager

A stateless session manager written in Node.js. Its main function is to manage request/response calls between Android clients and back-end services such as dispatch,billing and goSwift API (business layer). Calls between Conman and mobile clients are in JSON over HTTPS. 

Calls to DISPATCH use Thrift serialization over TChannel protocol while method calls to billing use JSON/HTTP. Some Async calls between CONMAN and DISPATCH may be handled through a message broker (RabbitMQ). Conman is designed to scale horizontally.

Examples:
•	When customer request fare estimates, CONMAN will calculate distance estimate of trip and 
request billing service to estimate the fare and return this to rider


NPM PACKAGES

- npm install express
- npm install http
- npm install nodemailer
- npm install thriftrw
- npm install path
- npm install tchannel
- npm install mongoose
- npm install smpp
- npm install underscore
- npm install body-parser
- npm install winston
