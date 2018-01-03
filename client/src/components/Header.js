import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {RaisedButton} from 'material-ui'
import '../styles/Header.css'

import {graphql} from 'react-apollo';
import gql from 'graphql-tag'
import logo from '../chatLogo.png'

const LOGGED = localStorage.getItem('USER_ID')
const cls = s => s ? `Header-${s}` : 'Header'
class Header extends React.Component {
  _renderLogin () {
    const onClick = e => {
      this.props.history.push('/login')
    }
    return (
      <RaisedButton
        label='Login'
        onClick={onClick}
        primary
        />
    )
  }

  _renderLogoutDashboard () {
    const onLogoutClick = e => {
      localStorage.removeItem('USER_ID')
      this.props.history.push('/')
      // this is an hack
      window.location.reload()
    }

    const onMyChatClick = e => {
      const {history} = this.props
      const id = LOGGED
      const dashboardPath = `/user/${id}`
      if (history.location.pathname === dashboardPath) {
        return null
      }
      history.push(dashboardPath)
    }

    return (
      <div className={cls('actions')}>
        <div className={cls('actions-myChat')} onClick={onMyChatClick}>
          My chat
        </div>
        <RaisedButton
          label='Logout'
          onClick={onLogoutClick}
          primary
          />
      </div>
    )
  }

  render () {
    let actions
    if (LOGGED) {
      actions = this._renderLogoutDashboard()
    } else {
      actions = this._renderLogin()
    }
    return (
      <div className={cls()}>
        <Link to='/' className={cls('link')}>
          <img src={logo}/> <span>MessageToMe</span>
        </Link>
        {actions}
      </div>
    )
  }
}

export default withRouter(Header)
