import axios from 'axios';
import Cookies from 'universal-cookie';
import {CookiesManager} from '../workers';

const axiosInstance = axios.create({
  baseURL: process.env.baseURL,
});

const isHandlerEnabled = (config = {}) => {
  return !(config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled);
};

const requestHandler = (request) => {
  if (isHandlerEnabled(request)) {
    const cookies = new Cookies();
    const jwt = cookies.get('jwt');

    if (jwt) {
      request.headers['jwt'] = jwt;
      request.headers['Authorization'] = `Bearer ${jwt}`;
    }
  }
  return request;
};

axiosInstance.interceptors.request.use(
  request => requestHandler(request),
);

axiosInstance.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
);

const errorHandler = (error) => {
  if (isHandlerEnabled(error.config)) {
  }
  return Promise.reject({...error})
};

const successHandler = (response) => {
  if (isHandlerEnabled(response.config)) {
    if (response.data && response.data.token) {
      CookiesManager.setCookies(response.data);
    }
  }
  return response;
};

export default axiosInstance;
