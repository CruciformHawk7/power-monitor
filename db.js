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
    },

    getData: async(from, to, locations) => {
        if (locations == null)
            return await PowerData.find({ Date: { $gte: from, $lte: to } }, '-_id -Type');
        else
            return await PowerData.find({ Date: { $gte: from, $lte: to }, Location: { $in: locations } }, '-_id -Type');
    }

}