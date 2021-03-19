const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
var longitude=31.053650019;
var latitude=-17.938357;
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
    var long = req.param('longitude');
    let check1 = isLatitude(lat);
      let check2 = isLongitude(long);
      
      if(check1 && check2){
        
        if(lat != 0 && long != 0){
            console.log(check1)
        console.log(check2)
        longitude=long;
        latitude=lat;
        
      }
    }
    
    //sendToKafka(payload);
    res.send(200);
});
app.get('/gps', function(req, res){
    let data ={
        latitude:latitude,
        longitude:longitude
    }
    res.json(data); //also tried to do it through .send, but there data only on window in browser
});

function isLatitude(lat){
    return isFinite(lat) && Math.abs(lat) <= 90 && (typeof lat !== 'string' || lat.trim() !== '');
}
function isLongitude(lng){
    return isFinite(lng) && Math.abs(lng) <= 180 && (typeof lng !== 'string' || lng.trim() !== '');
}
app.listen(PORT, console.log(`Server running on port ${PORT}`));