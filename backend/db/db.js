import mongoose from 'mongoose'

// Ensure helpful defaults
mongoose.set('strictQuery', true);

function mask(uri) {
    return String(uri || '').replace(/:\/\/([^:@]+):([^@]+)@/, '://<redacted>:<redacted>@');
}

function buildUriFromParts() {
    const user = process.env.MONGODB_USERNAME;
    const pass = process.env.MONGODB_PASSWORD;
    const host = process.env.MONGODB_CLUSTER || process.env.MONGODB_HOST;
    const db = process.env.MONGODB_DBNAME || process.env.MONGODB_DATABASE || 'sports_equipment';
    if (!user || !pass || !host) return null;
    const encUser = encodeURIComponent(user);
    const encPass = encodeURIComponent(pass);
    return `mongodb+srv://${encUser}:${encPass}@${host}/${db}?retryWrites=true&w=majority`;
}

// Connect to MongoDB and throw on failure so callers can react appropriately
export const connectDb = async () => {
    const uri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== ''
        ? process.env.MONGODB_URI
        : buildUriFromParts();

    if (!uri) {
        throw new Error('MongoDB connection info missing. Set MONGODB_URI or the parts MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, and MONGODB_DBNAME');
    }

    console.log('Connecting to MongoDB:', mask(uri));

    try {
        await mongoose.connect(uri, {
            // Reasonable local dev defaults; keep timeouts short to fail fast
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
        });

        // Connection event logs (once)
        mongoose.connection.on('connected', () => console.log('MongoDB connected'));
        mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err.message));
        mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

        console.log('MongoDB connection successful');
        return mongoose.connection;
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        // Rethrow so the caller can stop server start
        throw err;
    }
}