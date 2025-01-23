import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    technology: { type: [String], required: true },
    images: { type: [String], default: [] },
    works: { type: [String], default: [] }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
