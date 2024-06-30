import { ApolloServer } from '@apollo/server';
import mongoose from 'mongoose';
import schema from './schema.js';
import dotenv from "dotenv"
import {startStandaloneServer} from '@apollo/server/standalone';
import { log } from '@nexus/schema/dist/utils.js';
dotenv.config({ path: ".env" });

// import { ApolloServer } from 'apollo-server'
// import { schema } from './schema'
// export const server = new ApolloServer({ schema })
// // api/index.ts
// import { server } from './server'
// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`)
// })
const server = new ApolloServer({ schema });

mongoose.connect(process.env.MONGODB_URI).then(async() => {
    const {url} = await startStandaloneServer(server,{
        listen:{port:4000}
    })
    console.log(`server ready at ${url} \ndb connected successfuly`);
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});