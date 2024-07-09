import mongoose from 'mongoose' ;
import logger from '../services/logger';

const connectToMongoDB = async (): Promise<void>=>{
    try {
		await mongoose.connect(process.env.MONGO_DB_URI as string);
		console.log("Connected to MongoDB");
		logger.info('Connected to MongoDB');
	} catch (error:any) {
		console.error("Error connecting to MongoDB");
		logger.error('Error connecting to MongoDB')
	}
}

export default connectToMongoDB;