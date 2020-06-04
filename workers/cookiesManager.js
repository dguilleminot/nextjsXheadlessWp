import Cookies from 'universal-cookie';

export default new class CookiesManager {
  constructor() {
    this.cookies = new Cookies();

    this.removeCookies = this.removeCookies.bind(this);
    this.setCookies = this.setCookies.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getConnexionData = this.getConnexionData.bind(this);
  }

  getConnexionData() {
    // verify token and connection data
    const {token, username, roles} = this.cookies.getAll();

    if (!token) {
      return false;
    }

    return {
      username,
      roles,
      token,
    };
  }

  getToken() {
    return this.cookies.get('jwt');
  }

  setCookies(data) {
    this.cookies.set('token', data.token);
    this.cookies.set('roles', data.roles);
    this.cookies.set('username', data.user_display_name);
  }

  removeCookies() {
    this.cookies.remove('token');
    this.cookies.remove('username');
    this.cookies.remove('roles');
  }
}
