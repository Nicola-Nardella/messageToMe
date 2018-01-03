import _ from 'lodash'
import { PubSub } from 'graphql-subscriptions'
import { withFilter } from 'graphql-subscriptions'

const users = [
  {
    id: '1',
    fullName: 'Nicola Nardella',
    username: 'nico',
    password: 'nico',
  },
  {
    id: '2',
    fullName: 'Mario Rossi',
    username: 'mari',
    password: 'mari',
  },
  {
    id: '3',
    fullName: 'Giuseppe Verdi',
    username: 'joseph',
    password: 'joseph',
  },
]

const conversations = [
  {
    id: '1',
    participants: [{
      id: '1',
      fullName: 'Nicola Nardella',
      username: 'NikNar',
    },
    {
      id: '2',
      fullName: 'Mario Rossi',
      username: 'MaRos',
    }],
    messages: [{
      id: '1',
      author: {
        id: '2',
        fullName: 'Mario Rossi',
        username: 'MaRos',
      },
      body: 'hello Nicola',
    },
    {
      id: '2',
      author: {
        id: '1',
        fullName: 'Nicola Nardella',
        username: 'NikNar',
      },
      body: 'hello Mario',
    }],
  },
  {
    id: '2',
    participants: [{
      id: '1',
      fullName: 'Nicola Nardella',
      username: 'NikNar',
    },
    {
      id: '3',
      fullName: 'Giuseppe Verdi',
      username: 'joseph',
    }],
    messages: [{
      id: '1',
      author: {
        id: '3',
        fullName: 'Giuseppe Verdi',
        username: 'joseph',
      },
      body: 'hello Nicola',
    },
    {
      id: '2',
      author: {
        id: '1',
        fullName: 'Nicola Nardella',
        username: 'NikNar',
      },
      body: 'hello Giuseppe',
    }],
  },
]

let nextId = 3
let nextConversationId = 2
let nextMessageId = 3

const pubsub = new PubSub()

export const resolvers = {
  Query: {
    users: (root, { id }) => {
      return users.filter(user => user.id !== id)
    },
    loginUser: (root, args) => {
      const user = users.find(u => u.username === args.username)
      if (!user) {
        throw new Error('No user with that username exists.')
      }
      if (user.password !== args.password) {
        throw new Error('Invalid password.');
      }
      return user
    },
    currentUser: (root, { id }) => {
      return users.find(user => user.id === id)
    },
    conversation: (root, { id, secondParticipantId }) => {
      if (secondParticipantId) {
        const conversationsFiltered = conversations.find(c => {
          const participantsIds = c.participants.map(p => p.id)
          return _.includes(participantsIds, id) && _.includes(participantsIds, secondParticipantId)
        })
        return conversationsFiltered
      } else {
        return conversations.find(conversation => conversation.id === id)
      }
    },

    conversations: (root, { fromId, toId }) => {
      return conversations.filter(conversation => conversation.from.id === fromId || conversation.to.id === toId)
    },
  },
  Mutation: {
    addUser: (root, { user }) => {
      const newUser = {
        id: String(nextId++),
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        password: user.password,
        conversation: [],
      }
      users.push(newUser)
      pubsub.publish('userAdded', { userAdded: newUser})
      return newUser
    },
    addConversation: (root, { firstParticipantId, secondParticipantId }) => {
      const newConversation = {
        id: String(nextConversationId++),
        participants: [firstParticipantId, secondParticipantId],
      }
      conversations.push(newConversation)
      return newConversation
    },
    forgotPassword: (root, args) => {
      const user = users.find(u => u.username === args.username)
      if (!user) {
        throw new Error('No user with that username exists.')
      }
      const newPassword = args.password
      user.password = newPassword
      return user
    },
    addMessages: (root, { message }) => {
      const conversation = conversations.find(c => c.id === message.conversationId)
      if(!conversation) {
        throw new Error("Conversation does not exist")
      }
      const newMessage = {
        id: String(nextMessageId++),
        conversationId: conversation.id,
        author: message.author,
        body: message.body,
        createdAt: +new Date(),
      }
      conversation.messages.push(newMessage)

      pubsub.publish('messagesAdded', { messagesAdded: newMessage, conversationId: message.conversationId })

      return newMessage
    },
  },
  Subscription: {
    messagesAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('messagesAdded'), (payload, variables) => {
        return payload.conversationId === variables.conversationId
      }),
    },
    userAdded: {
      subscribe: () => pubsub.asyncIterator('userAdded'),
    },
  },
}
