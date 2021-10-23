var mongoose = require('mongoose');
var config = require('../../config');

module.exports = {
    connect: () => {
        return new Promise((Resolve, Reject) => {
            mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
                err ? Reject(err) : Resolve()
            });
        })
    }
}

mongoose.connection.on('connected', () => {
    console.log("   [Mongoose] default connection is open ")
});

mongoose.connection.on('error', (err) => {
    console.log("   [MongooseError] default connection has occured " + err + " error")
});