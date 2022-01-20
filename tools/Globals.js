import axios from 'axios';
import global from '../utils/globals';

const config = {
  baseURL: '',
  udata: null,
  axiosHandle: () => {
    return axios.create({
      baseURL: `${config.baseURL}/api/`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer' + ' ' + global.getToken(),
      },
    });
  },
};

export default config;
