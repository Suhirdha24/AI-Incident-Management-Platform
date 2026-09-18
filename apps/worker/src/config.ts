import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Resolve Windows DNS SRV lookup issues for MongoDB Atlas (+srv)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.WORKER_PORT || '5001', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/opsai',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini'
};
