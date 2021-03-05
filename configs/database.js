const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/HLL', { useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log('DB Connected!')).catch(err => { console.log(`DB Connection Error: ${err.message}`) })
module.exports = mongoose