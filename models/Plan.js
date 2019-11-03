const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const PlanSchema = new mongoose.Schema({
    place: String,
    startDate: String,
    endDate: String,
    otherDetails: String,
    members: [ObjectId]
});

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
