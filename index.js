const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const path = require('path');
const Kafka = require("node-rdkafka"); // see: https://github.com/blizzard/node-rdkafka 
const externalConfig = require('./config'); 
const sendToKafka = require('./prod');
const CONSUMER_GROUP_ID = "node-consumer" 
// construct a Kafka Configuration object understood by the node-rdkafka library 
// merge the configuration as defined in config.js with additional properties defined here 
const kafkaConf = {...externalConfig.kafkaConfig ,
 ...{ "group.id": CONSUMER_GROUP_ID,
 "socket.keepalive.enable": true,
 "debug": "generic,broker,security"} 
}; 
const topics = [externalConfig.topic] 
const app = express();

const PORT = process.env.PORT || 8080

app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('', (req, res) => {
    
    res.render('home')
});

app.post('/api/users', function(req, res) {
    var lat = req.param('latitude');
    var lon = req.param('longitude');
    let payload ={
        latitude:lat,
        longitude:lon
    }
    
    sendToKafka(payload);
    res.send(200);
});
let stream = new Kafka.KafkaConsumer.createReadStream(kafkaConf, { "auto.offset.reset": "earliest" }, { topics: topics })
stream.on('data', function (message) { 

  try{
      const jsonObj = JSON.parse(message.value.toString())
      const longitude = jsonObj.longitude;
      const latitude = jsonObj.latitude;
      const timestamp = JSON.parse(message.timestamp.toString())
      const offset = JSON.parse(message.offset.toString())
   
      console.log(longitude,timestamp, offset, latitude);
      
  }
  catch (error) {
      console.log('err=', error)
  }
}); 
console.log(`Stream consumer created to consume from topic ${topics}`); 
stream.consumer.on("disconnected", function (arg) {
 console.log(`The stream consumer has been disconnected`)  
 process.exit(); 
}); 
app.listen(PORT, console.log(`Server running on port ${PORT}`));