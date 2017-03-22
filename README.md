# goSwift-Conman

goSwift's connection request manager

A stateless session manager written in Node.js. Its main function is to manage request/response calls between Android clients and back-end services such as dispatch,billing and goSwift API (business layer). Calls between Conman and mobile clients are in JSON over HTTPS. Calls to dispatch and billing are also in JSON/HTTP (may look at transitioning to Thrift or messagepack in near future). Certain Async calls may be handled through a message broker such as RabbitMQ. Conman should be designed to scale horizontally.

Examples:
•	When customer request fare estimates, CONMAN will calculate distance estimate of trip and 
request billing service to estimate the fare and return this to rider
