import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    typePosition: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false, default: null },
    description :{ type: Array, required: true },
    location: { type: String, required: true },
});

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;