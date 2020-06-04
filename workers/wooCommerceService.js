import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import axios from './axios';

const wooCommerceService = new WooCommerceRestApi({
  url: process.env.url,
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  version: 'wc/v3',
  queryStringAuth: true,
});

export default wooCommerceService;
