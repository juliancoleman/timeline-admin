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
};

module.exports = Api;
