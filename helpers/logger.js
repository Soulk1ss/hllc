const fs = require("fs")
const path = require('path')
const logDir = path.resolve('logs')
const project = "HLLC";
const rotate = 15;
function getLogFileName(type) {
    return project + '_' + type + '_' + getDateTimeFormat() + '.log';
}
function getDateTimeFormat() {

    var years = new Date().getFullYear();
    var months = new Date().getMonth() + 1;
    var day = new Date().getDate();
    var hours = new Date().getHours();
    var mins = new Date().getMinutes();
    var monthFormatted = months < 10 ? "0" + months : months;
    var dayFormatted = day < 10 ? "0" + day : day;
    var hourFormatted = hours < 10 ? "0" + hours : hours;
    var result = "";
    var minFormatted = null;
    var div = null;

    if ((mins % rotate) > 0) {
        minFormatted = ((Math.floor(mins / rotate)) * rotate);
    }
    else {
        minFormatted = mins;
    }
    minFormatted = minFormatted < 10 ? "0" + minFormatted : minFormatted;
    result = '' + years + monthFormatted + dayFormatted + hourFormatted + minFormatted;
    return result;
}
function getDateTimeLogFormat() {
    var dates = new Date();
    var years = dates.getFullYear();
    var months = dates.getMonth() + 1;
    var day = dates.getDate();
    var hours = dates.getHours();
    var minutes = dates.getMinutes();
    var second = new Date().getSeconds();
    var millisecs = dates.getMilliseconds();
    var monthFormatted = months < 10 ? "0" + months : months;
    var dayFormatted = day < 10 ? "0" + day : day;
    var hourFormatted = hours < 10 ? "0" + hours : hours;
    var minFormatted = minutes < 10 ? "0" + minutes : minutes;
    var secFormatted = second < 10 ? "0" + second : second;
    var milliFormatted = null;

    if (millisecs < 10) {
        milliFormatted = "00" + millisecs;
    }
    else if (millisecs < 100) {
        milliFormatted = "0" + millisecs;
    }
    else {
        milliFormatted = millisecs;
    }

    return '[' + years + '-' + monthFormatted + '-' + dayFormatted + ' ' + hourFormatted + ':' + minFormatted + ':' + secFormatted + ':' + milliFormatted + ']';
}
function logger() { }
logger.prototype.writeError = function (method, req, startTime, err) {
    
    var logString = '';
    logString = appendLog(logString, '----- Start ' + method + ' -----');
    logString = appendLog(logString, '----- incomming parameters Headers [' + JSON.stringify(req.headers) + '] -----');
    logString = appendLog(logString, '----- incomming parameters Body [' + JSON.stringify(req.body) + '] -----');
    logString = appendLog(logString, '----- request ip [' + req.ip + '] -----');
    logString = appendLog(logString, '----- start time [' + startTime + '] -----');
    if (err) {
        logString = appendLog(logString, '----- error Message[' + err + '] -----');
    }
    writeLog('error', logString);
    
}
logger.prototype.writeLogs = function (method) {
    var logString = '';
    logString = appendLog(logString, '----- Start ' + method + ' -----');
    writeLog('info', logString);
}
logger.prototype.writeInfo = function (method, req, startTime) {
    /*
    var logString = '';
    logString = appendLog(logString, '----- Start ' + method + ' -----');
   
    logString = appendLog(logString, '----- incomming parameters Headers [' + JSON.stringify(req.headers) + '] -----');
    if (Object.keys(req.body).length  > 0) {
        logString = appendLog(logString, '----- incomming parameters Body [' + JSON.stringify(req.body) + '] -----');
    } 
    if(req.params.id){
        logString = appendLog(logString, '----- incomming parameters ID [' + JSON.stringify(req.params.id) + '] -----');
    }
    if(Object.keys(req.query).length > 0){
        logString = appendLog(logString, '----- incomming parameters Query [' + JSON.stringify(req.query) + '] -----');
    }
    logString = appendLog(logString, '----- request ip [' + req.ip + '] -----');
    logString = appendLog(logString, '----- start time [' + startTime + '] -----');
    writeLog('info', logString);
    */
}
function writeLog(type, logString) {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
    var stream = fs.createWriteStream(logDir + '/' + getLogFileName(type), { 'flags': 'a' });
    stream.once('open', function (fd) {
        stream.write(getDateTimeLogFormat() + ' - log: ' + logString + '\n');
        stream.end();
    })
}
function appendLog(src, dest) {
    if (src == '') src = '';
    return src + getDateTimeLogFormat() + ' - info: ' + dest + '\n';
}
module.exports = logger;