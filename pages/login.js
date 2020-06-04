import Navigation from '../components/Navigation';
import React, { Component, Fragment } from 'react';
import {axios} from '../workers';
import Router from 'next/router';

export default class extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      secret: '',
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {email, secret} = this.state;

    try {
      const tokenData = await axios.post(`/jwt-auth/v1/token?username=${email}&password=${secret}`);
      Router.push('/products');
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <Fragment>
        <Navigation/>
        <h1>Login</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              required
              id="email"
              label="Email Address"
              placeholder="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={this.state.email}
              onChange={this.handleInput}
              />
            <input
              required
              name="secret"
              label="Mot de passe"
              placeholder="Mot de passe"
              type="password"
              id="secret"
              autoComplete="current-secret"
              value={this.state.secret}
              onChange={this.handleInput}
              />
            <button type="submit">
              Connexion
            </button>
          </form>
      </Fragment>
    )
  }
}
