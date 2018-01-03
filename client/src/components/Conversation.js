import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

import Message from './Message'
import Loader from './Loader'
import AddMessage from './AddMessage'
import '../styles/Conversation.css'

const cls = s => s ? `Conversation-${s}` : 'Conversation'
class Conversation extends React.Component {
  static propTypes = {
    firstParticipantId: PropTypes.string,
    secondParticipantId: PropTypes.string,
  }

  render () {
    const {error, loading, users, conversation} = this.props.data
    const {firstParticipantId, secondParticipantId} = this.props
    if (loading) {
      return <Loader />
    }
    if (error) {
      return <div>{error.message}</div>
    }
    let content
    if (_.isNull(conversation)) {
      content = <div className={cls('empty')}>Start chat</div>
    } else {
      content = conversation.messages.map(message => <Message message={message} key={message.id}/>)
    }
    return (
      <div className={cls()}>
        {content}
        <AddMessage
          conversation={conversation}
          firstParticipantId={firstParticipantId}
          secondParticipantId={secondParticipantId}
          />
      </div>
    )
  }
}

export const conversationQuery = gql`
query conversationQuery($firstParticipantId : ID!, $secondParticipantId: ID) {
  conversation(id:$firstParticipantId, secondParticipantId:$secondParticipantId) {
    id
    messages {
      id
      author {
        id,
        fullName,
        username,
      },
      body,
    }
  }
}
`

export default (graphql(conversationQuery, {
  options: (props) => ({
    pollInterval: 1000 ,
    variables: {
      firstParticipantId: props.firstParticipantId,
      secondParticipantId: props.secondParticipantId,
    },
  }),
})(Conversation))
