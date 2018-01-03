import _ from 'lodash'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'

import SearchUser from './SearchUsers'
import Conversation from './Conversation'
import AddMessage from './AddMessage'
import '../styles/Dashboard.css'

class Dashboard extends React.Component {
  state = {}

  componentWillMount () {
    const {userId} = this.props.match.params
    const id = localStorage.getItem('USER_ID')
    if (userId !== id) {
      this.props.history.push('/')
    }
  }

  _onClick = (firstParticipantId, secondParticipantId) => {
    this.setState({firstParticipantId, secondParticipantId})
  }

  _renderConversation () {
    const {firstParticipantId, secondParticipantId} = this.state
    if (!firstParticipantId) {
      return null
    }
    return (
      <Conversation
        firstParticipantId={firstParticipantId}
        secondParticipantId={secondParticipantId}
        />
    )
  }

  render () {
    const {firstParticipantId, secondParticipantId} = this.state
    return (
      <div className='Dashboard'>
        <div>
          <SearchUser onClick={this._onClick}/>
        </div>
        <div>
          {this._renderConversation()}
        </div>
      </div>
    )
  }
}

export default withRouter(Dashboard)
