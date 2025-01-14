import app from './app.js';
import connectDB from './db.js';

connectDB();

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : process.env.PORT_DEV;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}--`);
});
