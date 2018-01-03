import React from 'react'
import {Link} from 'react-router-dom'

import logo from '../chatLogo.png'
import '../styles/Home.css'

const cls = s => s ? `Home-${s}` : 'Home'
export default class Home extends React.Component {

  componentWillMount () {

  }

  _renderContent () {
    const LOGGED = localStorage.getItem('USER_ID')
    if (LOGGED) {
      return null
    }
    return (
      <div className={cls('content')}>
        <Link to='/register' className={cls('content-link')}>
          Create an account
        </Link>
        today and chat with everyone. If you have an account
        <Link to='/login' className={cls('content-link')}>
          login
        </Link>
        and start chatting
      </div>
    )
  }

  render () {
    return (
      <div className={cls()}>
        <div className={cls('title')}>
          <img src={logo}/> MessageToMe
        </div>
        <div className={cls('subtitle')}>
          This is a simple chat where you can share your idea, your worry, your dream
        </div>
        {this._renderContent()}
      </div>
    )
  }
}
