const express = require('express')
const server = express()
const dotENV = require('dotenv').config();
const PORT = 8000 + parseInt(process.env.INSTANCE_ID)
const bodyParser = require("body-parser")
const expressSession = require('cookie-session')
const router = require('./routes')
const events = require('./events');
const io = require('socket.io');
const path = require('path')
//const pm2Adapter = require('socket.io-pm2');
const redisAdapter = require('socket.io-redis');

//const adaptIo = require('socket.io-pm2');
//io.adapter(adaptIo());
//frontend run time
server.use(express.static(path.join(__dirname,'./public')));
// Allow image content
server.use('/api/uploads/', express.static(`${__dirname}/uploads/activityFlower`))
// ตั้งค่าการใช้งาน session //
server.use(expressSession({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))
// create custom functions
server.use(require('./configs/middleware'))
// ตั้งค่าการ Parser เมื่อ client ส่ง reques เข้ามา
server.use(bodyParser.urlencoded({ extended: false, limit: '500MB' }))
server.use(bodyParser.json({ limit: '500MB' }))
server.use('/api', router)

server.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});



//server.use(express.static(`${__dirname}/www`))
server.get('*', (req, res) => {

    //res.sendFile(`${__dirname}/www/index.html`)
    res.end(`<h1>Server is started</h1>`)
})









const backendServer = server.listen(PORT, () => console.log('Server is started.Port ' + PORT + '.'))
const newIO = io(backendServer)
// newIO.adapter(redisAdapter())
new events(newIO).eventsConfig();
