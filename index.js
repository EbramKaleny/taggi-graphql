import { ApolloServer } from '@apollo/server';
import mongoose from 'mongoose';
import schema from './schema.js';
import dotenv from "dotenv"
import {startStandaloneServer} from '@apollo/server/standalone';
dotenv.config({ path: ".env" });

const server = new ApolloServer({ schema });

mongoose.connect(process.env.MONGODB_URI).then(async() => {
    const {url} = await startStandaloneServer(server,{
        listen:{port:4000}
    })
    console.log(`server ready at ${url} \ndb connected successfuly`);
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});