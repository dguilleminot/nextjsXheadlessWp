import Navigation from '../components/Navigation';
import React, { Component, Fragment } from 'react';
import {wooCommerceService} from '../workers';

export default class extends Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    try {
      const posts = await wooCommerceService.get('products', {per_page: 20});
      this.setState({posts: posts.data});
    } catch(err) {
      console.log(err);
    }
  }

  renderProducts(posts) {
    return(
      <ul>
      {
        posts.map( post => {
          return (
            <li key={ post.id }>
              <article>
                <h3>{ post.name } <sup>{ post.price }€</sup></h3>
                <div dangerouslySetInnerHTML={{__html: post.short_description}}></div>
              </article>
            </li>
          )
        })
      }
      </ul>
    );
  }

  renderFeatching() {
    return(
      <p>featching data</p>
    )
  }

  render() {
    const {posts} = this.state;

    return (
      <Fragment>
        <Navigation/>
        <h1>Products</h1>
        { posts ? this.renderProducts(posts) : this.renderFeatching() }
      </Fragment>
    );
  }
}
