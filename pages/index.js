import Head from 'next/head';
import Navigation from '../components/Navigation';
import { Fragment } from 'react';

export default () => (
  <Fragment>
      <Head>
        <title>Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation/>
      <h1>server-side rendered React.js app</h1>
  </Fragment>
)
