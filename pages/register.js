import React from 'react';
import Navigation from '../components/Navigation';
import Router from 'next/router';
import {axios} from '../workers';
import {CookiesManager} from '../workers';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLog: false,
      username: '',
      email: '',
      password: '',
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSave(e) {
    e.preventDefault();
    const {username, email, password} = this.state;
    try {
      const user = await axios.post('/users/register', {username, email, password});
      CookiesManager.setCookies(user.data)
      Router.push('/products');
    } catch(e) {
      console.log(e);
    }
  }

  handleCancel(item) {
    Router.push('/products');
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const {username, email, password, isLog} = this.state;
    return (
      <section>
        <Navigation isLog={isLog}/>
        <h1>Register</h1>
        <form onSubmit={this.handleSave}>
          <input placeholder="Username" name="username" required variant="outlined"
            value={username} onChange={this.handleChange}
          />
          <input placeholder="Email" type="email" name="email" required
            value={email} onChange={this.handleChange}
          />
          <input placeholder="Mot de  passe" type="password" name="password" required
            value={password} onChange={this.handleChange}
          />

          <footer justify="center">
            <button onClick={() => this.handleCancel()}>
              annuler
            </button>
            <button type="submit">
              sauvegarder
            </button>
          </footer>
        </form>
      </section>
    );
  }
}
