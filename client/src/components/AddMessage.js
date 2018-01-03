import _ from 'lodash'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {TextField, RaisedButton} from 'material-ui'
import PropTypes from 'prop-types'

import {graphql, withApollo, compose} from 'react-apollo';
import gql from 'graphql-tag'

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';

import Message from './Message'
import Loader from './Loader'

import {conversationQuery} from './Conversation'
import '../styles/AddMessage.css'

const cls = s => s ? `AddMessage-${s}` : 'AddMessage'
class AddMessage extends React.Component {
  static propTypes = {
    conversation: PropTypes.object,
    firstParticipantId: PropTypes.string,
    secondParticipantId: PropTypes.string,
  }

  state = {message: ''}

  onChangeMessage = e => {
    const value = e.target.value
    this.setState({message: value})
  }

  _onSubmit = e => {
    e.preventDefault()

    const {addConversation, addMessage, match, conversation, firstParticipantId, secondParticipantId} = this.props
    const {message} = this.state
    const mutationAddMessage = id => {
      return {
        variables: {
          message: {
            conversationId: id,
            author: {
              id: match.params.userId,
              username: '',
            },
            body: message,
          }
        }
      }
    }
    if (!conversation) {
      addConversation({
        variables: {
          firstParticipantId: firstParticipantId,
          secondParticipantId: secondParticipantId,
        }
      })
      .then(({data}) => {
        const conversationId = data.addConversation.id
        addMessage(mutationAddMessage(conversationId))
      })
    } else {
      addMessage(mutationAddMessage(conversation.id))
    }

    this.setState({message: ''})
  }

  _renderContent () {
    return (
      <div className={cls()}>
        <form
          className={cls('content')}
          onSubmit={this._onSubmit}
          >
          <TextField
            floatingLabelText="Send Message"
            value={this.state.message}
            onChange={this.onChangeMessage}
            />
        </form>
      </div>
    )
  }

  render () {
    return (
      <div>
        {this._renderContent()}
      </div>
    )
  }
}

const addMessageMutation = gql`
mutation addMessages($message: MessagesInput!) {
  addMessages(message: $message) {
    conversationId
    author{
      id
    }
    body
  }
}
`
const addConversationMutation = gql`
mutation addConversation($firstParticipantId: ID!,$secondParticipantId: ID!) {
  addConversation(firstParticipantId: $firstParticipantId, secondParticipantId: $secondParticipantId) {
    id
  }
}
`
export default compose(
  graphql(addConversationMutation, {name: 'addConversation'}),
  graphql(addMessageMutation, {name: 'addMessage'}),
)(withRouter(AddMessage))
