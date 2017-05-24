const Api = require("./Api");

const AuthService = {
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser() {
    return localStorage.getItem("user");
  },
  removeUser() {
    localStorage.removeItem("user");
  },
  setToken(token) {
    localStorage.setItem("token", token);
  },
  getToken() {
    return localStorage.getItem("token");
  },
  removeToken() {
    localStorage.removeItem("token");
  },
  logout() {
    this.removeUser();
    this.removeToken();
  },
  validateToken() {
    const r = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

    return r.test(this.getToken());
  },
};

module.exports = AuthService;
