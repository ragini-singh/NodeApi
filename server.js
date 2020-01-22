const express = require('express');
const BodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var database, collection;

const App = express();


App.use(BodyParser.urlencoded({extended: false}));
App.use(BodyParser.json());



App.get('/people', function (req, res) {
    const validFields = validateRequest(req.body);
        if(validFields.length > 0){
            return res.status(400).send(validFields);
        }
    const data = collection.find({}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

App.post('/people', function (req, res) {
    if (req.body) {
        const validFields = validateRequest(req.body);
        if(validFields.length > 0){
            return res.status(400).send(validFields);
        }
        collection.insert(req.body, (error, result) => {
            if(error) {
                return res.status(500).send({'message' : error.errmsg});
            }
            res.send({'message' : 'data inserted'});
        });
    } else{
        res.status(400).send({'message' : 'request incorrect'});
    }
    
});

const validateRequest = (data) => {
    let res = [];
    if(data.email){
        if( !validateEmail(data.email)){
            res.push({'email' : 'invalid format'})
        }
    }else{
        res.push({'email' : 'is required'})
    }
    if(data.password){
        if(data.password.length < 6){
            res.push({'password' : 'is too short'}) 
        }
    }else {
        res.push({'password' : 'is required'})
    }
    if(!data.name){
        res.push({'name' : 'is required'});
    }
    if(data.confirmPassword){
        if(data.confirmPassword !== data.password ){
            res.push({'passwordConfirmation': 'must match confirmation.'})
        }
    }

    return res;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

App.post('/login', function (req, res) {
    if (req.body) {
        const validFields = validateRequest1(req.body);
        if(validFields.length > 0){
            return res.status(400).send(validFields);
        }
        collection.insert(req.body, (error, result) => {
            if(error) {
                return res.status(500).send({'message' : error.errmsg});
            }
            res.send({'message' : 'data inserted'});
        });
    } else{
        res.status(400).send({'message' : 'request incorrect'});
    }
    
});

const validateRequest1 = (data) => {
    let res = [];
    if(data.email ||data.phoneNumber){
        if( !validateEmail(data.email)){
            res.push({'email' : 'invalid format'})
        }
    }else{
        res.push({'email' : 'is required'})
    }
    if(data.password){
        if(data.password.length < 6){
            res.push({'password' : 'is too short'}) 
        }
    }else {
        res.push({'password' : 'is required'})
    }
    return res;
}



App.listen(7777, function () {

    MongoClient.connect('"mongodb://localhost:27017/test', {useNewUrlParser: true}, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db('test');
        collection = database.collection("personnel");
        console.log("Connected to test ");
    });
    console.log('Server is running on port 7777')
});
