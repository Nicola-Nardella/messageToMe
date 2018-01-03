import _ from 'lodash'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {TextField, RaisedButton} from 'material-ui'
import PropTypes from 'prop-types'

import {graphql, withApollo} from 'react-apollo';
import gql from 'graphql-tag'

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';

import Message from './Message'
import Loader from './Loader'

const cls = s => s ? `SearchUser-${s}` : 'SearchUser'
class SearchUser extends React.Component {

  static propTypes = {
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: () => {},
  }

  state = {}

  componentWillMount () {
    const {userId} = this.props.match.params
    this.props.client.query({
      query: gql`
      {
        users(id:${userId}) {
          id
          fullName
          username
        }
      }`
    })
    .then(({data}) => {
      this.setState({userId, users: data.users, canRender: true})
    })
  }

  _renderSearch () {
    const {users, userId} = this.state
    const dataSource = users.map(u => ({
      text: u.username,
      value: <MenuItem primaryText={u.username} onClick={this.props.onClick.bind(this, userId, u.id)}/>
    }))
    return (
      <AutoComplete
        floatingLabelText="Search user"
        filter={AutoComplete.caseInsensitiveFilter}
        dataSource={dataSource}
        />
    )
  }

  render () {
    if (!this.state.canRender) {
      return <Loader />
    }
    return (
      <div className={cls()}>
        {this._renderSearch()}
      </div>
    )
  }
}

export default withRouter(withApollo(SearchUser))
