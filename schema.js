import { makeSchema, objectType, stringArg, idArg } from '@nexus/schema';
import graphqldate from 'graphql-iso-date';
import Post from './post.js';
import mongoose from "mongoose"

const {GraphQLDateTime} = graphqldate

const PostType = objectType({
  name: 'Post',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('content');
    t.string('author');
    t.field('createdAt', { type: 'DateTime' });
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('posts', {
      type: 'Post',
      resolve: async () => await mongoose.find(),
    });
    t.field('post', {
      type: 'Post',
      args: { id: idArg() },
      resolve: async (parent, { id }) => await mongoose.findById(id),
    });
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createPost', {
      type: 'Post',
      args: {
        title: stringArg(),
        content: stringArg(),
        author: stringArg(),
      },
      resolve: async (parent, { title, content, author }) => {
        const post = new Post({ title, content, author });
        await post.save();
        return post;
      },
    });
    t.field('updatePost', {
      type: 'Post',
      args: {
        id: idArg(),
        title: stringArg(),
        content: stringArg(),
        author: stringArg(),
      },
      resolve: async (parent, { id, title, content, author }) => {
        const post = await mongoose.findById(id);
        if (!post) throw new Error(`Post with ID ${id} not found`);
        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;
        if (author !== undefined) post.author = author;
        await post.save();
        return post;
      },
    });
    t.field('deletePost', {
      type: 'Post',
      args: { id: idArg() },
      resolve: async (parent, { id }) => {
        const post = await mongoose.findByIdAndDelete(id);
        if (!post) throw new Error(`Post with ID ${id} not found`);
        return post;
      },
    });
  },
});

const schema = makeSchema({
  types: [Query, Mutation, PostType, GraphQLDateTime],
});

export default schema;