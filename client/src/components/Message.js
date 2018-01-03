import classnames from 'classnames'
import React from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router-dom'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import '../styles/Message.css'

const cls = s => s ? `Message-${s}` : 'Message'
class Message extends React.Component {

_isMine () {
  const {id} = this.props.message.author
  const {userId} = this.props.match.params
  return userId === id
}

  render () {
    const {message} = this.props
    const className = classnames(cls(), {
      [cls('-isMine')]: this._isMine(),
    })
    const writeBy = this._isMine() ? 'me' : message.author.username
    return (
      <div className={className}>
        <div className={cls('author')}>
          write by {writeBy}
        </div>
        <div className={cls('body')}>
          {message.body}
        </div>
      </div>
    )
  }
}

export default withRouter(Message)
