var smpp   = require('smpp');
var _      = require("underscore");
//var logger = require("./config/logger");
var logger = require("./config/logutil");

var session = null;
var credentials = {
      system_id: '70754',
      password: 'mah1matu'
  };
//console.log(session);

function connectSMPP(){
    console.log("before attemptimg connection to SMS gateway");
    try{
        session = smpp.connect('bulksms.2way.co.za', 2775);
        session.bind_transceiver(credentials, function(pdu) {
            //pdu.response();
            logger.info("attemptimg connection to SMS gateway with user_id:" + credentials.system_id)
        	if(pdu.command_status == 13){
        	   console.log("session" + pdu.command_status);
        	   pdu.response();
        	   console.log(JSON.stringify(pdu));
               return null;
        	}
            if (pdu.command_status == 0) {
                // Successfully bound
                //pdu.response();
                logger.debug('successfully bound transceiver');
                logger.debug(JSON.stringify(pdu));
                return session;
            }
        });
    }catch (err){
        logger.error("error binding to SMS Gateway " + err);
    }
}

var sendSMS = function(mobile, msg){
    var message_config = {
            dest_addr_ton: 1,
            dest_addr_npi: 1,
            destination_addr: mobile,
            short_message: new Buffer(msg,"utf-8"),
            registered_delivery:1,
            source_addr_ton: 1,
            source_addr_npi: 1,
            source_addr: '27767892418',
            data_coding:0
    };
    console.log("Sending : " + msg + "...to ->" + mobile);
    
    console.log("isEmpty=" + !mobile);
    console.log(" isNumber=" + (_.isNumber(mobile)===true));
    console.log(" isLength<10 =" + (mobile.length < 10));

    if(mobile.length < 10){
        console.log("No valid mobile number :" + mobile);
        return;
    }
    session.submit_sm(message_config, function(pdu) {
        //pdu.response();
        console.log(JSON.stringify(pdu));
        if(pdu.command_status == 11){
            logger.error("Invalid destination address, command status :" + pdu.command_status);
        }
        if (pdu.command_status == 0) {
            // Message successfully sent
            console.log("Message successfully sent");
        }
    });

    session.on('deliver_sm', function(pdu) {
    console.log(pdu.short_message);
    session.send(pdu.response());
    });
}

//uncomment to test the module
/*connectSMPP();
sendSMS("27847849574" , "Hello people of the south");
*/

module.exports.connectSMPP = connectSMPP;
module.exports.sendSMS = sendSMS;
/*
this is not working as connectSMPP immediately returns with false
 due to ASYNC call nature and the successful connection happens only after.

if(connectSMPP()){
    sendSMS("0847849574" , "Hello people of the south");
}
else{
    console.log("failed to connect to SMS Gateway");
}*/
