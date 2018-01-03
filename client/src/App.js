import React from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import { WebSocketLink } from "apollo-link-ws"
import { SubscriptionClient } from 'subscriptions-transport-ws'

import {ApolloProvider} from 'react-apollo'
import { ApolloLink } from 'apollo-link'
import {ApolloClient} from 'apollo-client'
import {HttpLink, createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import gql from 'graphql-tag'

import Header from './components/Header'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Dashboard from './components/Dashboard'

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' })
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('USER_ID') || null
    }
  })
  return forward(operation)
})

const link = ApolloLink.from([
  middlewareLink,
  httpLink,
])

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <MuiThemeProvider>
          <BrowserRouter>
            <div className="App">
              <Header />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/user/:userId" component={Dashboard} />
                <Route path='*' render={props => <Redirect to={{pathname: '/register'}}/>}/>
              </Switch>
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      </ApolloProvider>
    )
  }
}

export default App
