import React from 'react'
import {Link, withRouter} from 'react-router-dom'

import {TextField, RaisedButton} from 'material-ui'
import {graphql} from 'react-apollo';
import gql from 'graphql-tag'

import Loader from './Loader'
import '../styles/Register.css'

const cls = s => s ? `Register-${s}` : 'Register'
class Register extends React.Component {

  state = {}

  onFullNameChange = e => {
    const value = e.target.value
    this.setState({fullName: value})
  }

  onEmailChange = e => {
    const value = e.target.value
    this.setState({email: value})
  }

  onUsernameChange = e => {
    const value = e.target.value
    if (value.match(/\s/g)) {
      this.setState({usernameError: 'no white space for username'})
    } else {
      this.setState({usernameError: ''})
    }
    this.setState({username: value})
  }

  onPasswordChange = e => {
    const value = e.target.value
    this.setState({password: value})
  }

  _onSubmit = e => {
    e.preventDefault()
    const {mutate, match} = this.props
    const {fullName, email, username, password} = this.state
    mutate({
      variables: {
        user: {
          fullName: fullName,
          username: username,
          email: email,
          password: password,
        }
      },
    })
    this.props.history.push('/login')
  }

  render () {
    return (
      <div className={cls()}>
        <div className={cls('title')}>
          Create new account
        </div>
        <form className={cls('content')} onSubmit={this._onSubmit}>
          <TextField
            name='fullName'
            floatingLabelText='Full name'
            onChange={this.onFullNameChange}
            />
          <TextField
            name='email'
            floatingLabelText='Email'
            type='email'
            validation='isEmail'
            onChange={this.onEmailChange}
            required
            />
          <TextField
            name='userName'
            floatingLabelText='Username'
            onChange={this.onUsernameChange}
            errorText= {this.state.usernameError}
            required
            />
          <TextField
            name='password'
            floatingLabelText='Password'
            type='password'
            onChange={this.onPasswordChange}
            required
            />
          <RaisedButton
            className={cls('button')}
            label='Register'
            type='submit'
            primary
            />
        </form>
      </div>
    )
  }
}

export const registerMutation = gql`
mutation addUser($user: RegistrationInput!) {
  addUser(user: $user) {
    fullName
    username
    email
    password
  }
}
`

export default graphql(registerMutation)(withRouter(Register))
