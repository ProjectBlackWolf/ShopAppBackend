import pkg from 'pg';
import dotenv from 'dotenv';
// import jwtGenerator from '../jwtGenerator';

const { Pool } = pkg;
dotenv.config();
const pool = new Pool({
                user: process.env.USER,
                host: process.env.HOST,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
                port: process.env.PORT
});
pool.connect();
console.log('did we connex');
export default pool