const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const path = require('path');
const { pool } = require("./dbConfig");
const app = express();
var longitude=31.053650019;
var latitude=-17.938357;
var pointsqq = [];
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
app.get('/statistics', (req,res) => {
    res.render('statistics',{layout:'./layouts/main1'});
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
        let datE = Date.now();
      
                   pool.query(
                       `INSERT INTO gpslocations (latitude, longitude, date)
                       VALUES ($1, $2, $3)`,
                       [latitude, longitude, datE], 
                       (err, results) => {
                           if(err){
                               throw err;
                           }
                           console.log(results.row);
                          
                       }
                   )
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
app.get('/points', function(req, res){
    let points = [];
    pool.query(
        `SELECT * FROM gpslocations`,
        (err, results) => {
            if(err){
                throw err;
            }
            
            let pointsq = results.rows;
            pointsq.forEach(point =>{
                points.push([point.longitude,point.latitude]);
            })
            
            res.json(points);
    
        }
    )
    
     //also tried to do it through .send, but there data only on window in browser
});
function isLatitude(lat){
    return isFinite(lat) && Math.abs(lat) <= 90 && (typeof lat !== 'string' || lat.trim() !== '');
}
function isLongitude(lng){
    return isFinite(lng) && Math.abs(lng) <= 180 && (typeof lng !== 'string' || lng.trim() !== '');
}

app.listen(PORT, console.log(`Server running on port ${PORT}`));