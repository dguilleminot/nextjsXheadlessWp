import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {CookiesManager} from '../workers';
import Router from 'next/router';


export default function Navigation(props) {
  const [user, setUser] = useState(CookiesManager.getConnexionData());

  const logout = () => {
    CookiesManager.removeCookies();
    Router.push('/');
  }

  const logoutBtn = () => {
    return (
      <div>
        <button onClick={logout}>logout</button>
        <p>hello Dear {user.username}</p>
      </div>
    )
  }

  return (
    <section>
      <ul>
      <li><Link href="/"><a href="/">Home</a></Link></li>
      <li><Link href="/products"><a href="/products">Products</a></Link></li>
      <li><Link href="/login"><a href="/login">Login</a></Link></li>
      <li><Link href="/register"><a href="/register">Register</a></Link></li>
      </ul>

      {user.token && logoutBtn()}
    </section>
  )
};
