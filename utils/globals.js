import Cookies from 'js-cookie';

const configCookies = {
  getToken: () => {
    if (Cookies.get('token')) return Cookies.get('token');
    else {
      return null;
    }
  },
  setToken: (token) => {
    Cookies.set('token', token);
  },
  clearCookies: () => {
    let keysToRemove = ['token'];
    keysToRemove.forEach((key) => Cookies.remove(key));
  },
};

export default configCookies;
