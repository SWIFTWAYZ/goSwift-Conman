/**
 * Created by dashville on 2017/04/02.
 */
var blueBird = require('bluebird');

var promisedFunc = blueBird.promisify(function(){
    console.log('promise');
});

promisedFunc();

 console.log('server  running');

  console.log('server  running......');