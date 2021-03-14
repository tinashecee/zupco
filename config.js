const topic = "q0sl66gr-zupcogpstracker" 
// set the correct topic name, especially when you are using CloudKarafka 
const kafkaConfig = { 
// Specify the endpoints of the CloudKarafka Servers for your instance found under Connection Details on the Instance Details Page 
// this looks like this: moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094" 
 "metadata.broker.list":"omnibus-01.srvs.cloudkafka.com:9094,omnibus-02.srvs.cloudkafka.com:9094,omnibus-03.srvs.cloudkafka.com:9094",
 "security.protocol": "SASL_SSL",
 "sasl.mechanisms": "SCRAM-SHA-256",
 "sasl.username": "q0sl66gr",
 "sasl.password": "qoQ1dpL3CkZnpysqZwPsIT2_HGX5Z_kV" 
}; module.exports = { kafkaConfig, topic };