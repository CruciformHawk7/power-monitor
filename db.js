var mongoose;
var db;
var secrets = require('./secrets');
var powerDataSchema, PowerData;


module.exports = {
    initialise: (mon) => {
        mongoose = mon;
        const { Schema } = mon;
        mongoose.connect(secrets.MongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        powerDataSchema = new mongoose.Schema({
            Location: String,
            Date: Date,
            UnitsConsumed: Number,
            Type: String
        });
        PowerData = mongoose.model('PowerData', powerDataSchema);
        passwordScheme = new mongoose.Schema({
            password: String
        });
        Password = mongoose.model('Password', passwordScheme);
        locationSchema = new mongoose.Schema({
            location: String
        });
        Location = mongoose.model('Location', locationSchema);
    },

    getData: async(from, to, locations) => {
        if (locations == null)
            return await PowerData.find({ Date: { $gte: from, $lte: to } }, '-_id -Type').sort({ Date: 'ascending' });
        else
            return await PowerData.find({ Date: { $gte: from, $lte: to }, Location: { $in: locations } }, '-_id -Type').sort({ Date: 'ascending' });
    },

    setData: async(hash, date, location, units) => {
        var res = await Password.find({ password: { $eq: hash } });
        //console.log(res);
        if (res.length == 1) {
            new PowerData({ Location: location, Date: date, UnitsConsumed: units, Type: "Real" }).save();
            return true;
        } else {
            return false;
        }
    },

    getLocs: async() => {
        return await Location.find({}, '-_id');
    }
}