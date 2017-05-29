const R = require("ramda");

const protocol = R.defaultTo("https", process.env.PROTOCOL);
const domain = R.defaultTo("summerpalooza.herokuapp.com", process.env.DOMAIN);
const port = R.defaultTo("", process.env.PORT);
const type = "api";
const semver = "v1";
const uri = `${protocol}://${domain}:${port}/${type}/${semver}`;

const getHeaders = () => new Headers({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
});

const parseQuery = (url, query) => {
  query = R.pick(R.identity, query);

  const q = Object.keys(query)
    .map(e => `${encodeURIComponent(e)}=${encodeURIComponent(query[e])}`)
    .join("&");

  return `${url}?${q}`;
};

const Api = {
  authenticate(email_address, password) { // eslint-disable-line
    return fetch(`${uri}/sessions`, {
      method: "POST",
      body: JSON.stringify({
        email_address,
        password,
      }),
    })
    .then(response => response.json());
  },
  refreshToken(token) {
    return fetch(`${uri}/sessions/refresh`, {
      method: "POST",
      body: JSON.stringify({
        token,
      }),
    })
    .then(response => response.json());
  },

  getUsers({ roles, enrolled, pageSize, page, sort }) {
    return fetch(parseQuery(`${uri}/users`, { roles, enrolled, pageSize, page, sort }), {
      method: "GET",
      headers: getHeaders(),
    })
    .then(response => response.json());
  },
  getUser(userId) {
    return fetch(`${uri}/users/${userId}`, {
      method: "GET",
      headers: getHeaders(),
    })
    .then(response => response.json());
  },
  createUser(body) {
    return fetch(`${uri}/users`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: getHeaders(),
    });
  },
  deleteUser(userId) {
    return fetch(`${uri}/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },
};

module.exports = Api;
