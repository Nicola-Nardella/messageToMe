import _ from 'lodash'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Redirect} from 'react-router-dom'

import {graphql, withApollo} from 'react-apollo'
import gql from 'graphql-tag'

import {TextField, RaisedButton} from 'material-ui'

import Loader from './Loader'
import '../styles/Login.css'

const cls = s => s ? `Login-${s}` : 'Login'
class Login extends React.Component {

  state = {usernameError: ''}

  componentWillMount () {
    const LOGGED = localStorage.getItem('USER_ID')
    if (LOGGED) {
      this.props.history.push('/')
    }
  }

  _onSubmit = e => {
    e.preventDefault()
    const {username, password} = this.state
    this.props.client.query({
      query: gql`
      {
        loginUser(username:"${username}", password:"${password}") {
          id
          username
        }
      }`
    })
    .then(({data:{loginUser}}) => {
      localStorage.setItem('USER_ID', loginUser.id)
      this.props.history.push(`/user/${loginUser.id}`)
      window.location.reload()
    })
    .catch(({message}) => this.setState({error: message}))
  }

  onUsernameChange = e => {
    const value = e.target.value
    this.setState({username: value})
  }

  onPasswordChange = e => {
    const value = e.target.value
    this.setState({password: value})
  }

  _renderError () {
    const {error} = this.state
    if (!error) {
      return null
    }
    setTimeout(() => {
      this.setState({error: null})
    }, 3000);
    return (
      <div className={cls('error')}>
        {error}
      </div>
    )
  }

  _onForgotPasswordClick = e => {
    this.setState({openModal: true, username: '', password: ''})
  }

  _isDisabled () {
    const {username, password} = this.state
    return _.isNil(username) || _.isNil(password)
  }

  _renderFormFields () {
    return (
      <div className={cls('formFields')}>
        <TextField
          name='userName'
          floatingLabelText='Username'
          onChange={this.onUsernameChange}
          value={this.state.username}
          required
          />
        <TextField
          name='password'
          floatingLabelText='Password'
          type='password'
          value={this.state.password}
          onChange={this.onPasswordChange}
          required
          />
      </div>
    )
  }

  _resetPassword = e => {
    e.preventDefault()
    const {mutate, match} = this.props
    const {fullName, email, username, password} = this.state
    mutate({
      variables: {
        username: username,
        password: password,
      },
    })
    .then(() => {
      this.setState({openModal: false})
    })
    .catch(({message}) => this.setState({error: message}))
  }

  _renderModal () {
    if (!this.state.openModal) {
      return null
    }
    return (
      <div className={cls('modal')}>
        <div className={cls('modal-content')}>
          <div className={cls('modal-close')} onClick={() => this.setState({openModal: false})}>
            <span>X</span>
          </div>
          {this._renderFormFields()}
          {this._renderError()}
          <RaisedButton
            className={cls('button')}
            label='Reset password'
            type='submit'
            onClick={this._resetPassword}
            disabled={this._isDisabled()}
            primary
            />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className={cls()}>
        <div className={cls('title')}>
          Login
        </div>
        <form className={cls('content')} onSubmit={this._onSubmit}>
            {this._renderFormFields()}
            {this._renderError()}
          <RaisedButton
            className={cls('button')}
            label='Login'
            type='submit'
            disabled={this._isDisabled()}
            primary
            />
        </form>
        <div className={cls('forgotPassword')} onClick={this._onForgotPasswordClick}>
          forgot password
        </div>
        {this._renderModal()}
      </div>
    )
  }
}

const forgotPasswordMutation = gql`
mutation forgotPassword($username: ID!, $password: ID!) {
  forgotPassword(username: $username, password: $password) {
   username
   password
  }
}
`

export default graphql(forgotPasswordMutation)(withRouter(withApollo(Login)))
