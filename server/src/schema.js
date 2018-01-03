import {makeExecutableSchema} from 'graphql-tools'

import {resolvers} from './resolvers'

const typeDefs = `
type User {
  id: ID!
  fullName: String
  username: String!
  email: String!
  password: String!
}

type Conversation {
  id: ID!
  participants: [User!]
  messages: [Message]
}

input ConversationInput {
  participants: [UserInput!]
}

type Message {
  id: ID!
  conversationId: ID!
  author: User!
  body: String!
  createdAt: Int
}

input UserInput{
  id: ID!
  fullName: String
  username: String!
}

input MessagesInput{
  conversationId: ID!
  author: UserInput
  body: String!
}

input RegistrationInput{
  fullName: String
  username: String!
  email: String!
  password: String!
}

# This type specifies the entry points into our API
type Query {
  users(id: ID!): [User]
  currentUser(id: ID!): User
  conversation(id: ID!, secondParticipantId: ID): Conversation
  conversations(fromId: ID, toId: ID): [Conversation]
  loginUser(username: ID!, password: ID!): User
}

# The mutation root type, used to define all mutations
type Mutation {
  addUser(user: RegistrationInput!): User
  addConversation(firstParticipantId:ID!, secondParticipantId:ID!): Conversation
  addMessages(message: MessagesInput!): Message
  forgotPassword(username: ID!, password: ID!): User
}

# The subscription root type, specifying what we can subscribe to
type Subscription {
  messagesAdded(conversationId: ID!): Message
  userAdded: User
}
`;

const schema = makeExecutableSchema({typeDefs, resolvers});
export {schema}
