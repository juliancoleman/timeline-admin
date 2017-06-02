const R = require("ramda");
const string = require("underscore.string");

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

const mapKeys = R.curry((fn, obj) =>
  R.fromPairs(R.map(R.adjust(fn, 0), R.toPairs(obj))));

const format = attrs => mapKeys(string.underscored, attrs);

const Api = {
  // authentication
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

  // users
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
  updateUser(user) {
    const allowedFields = [
      "firstName",
      "lastName",
      "campus",
      "homeAddress",
      "emailAddress",
      "phoneNumber",
      "emergencyContactName",
      "emergencyContactNumber",
      "emergencyContactRelationship",
      "allergies",
      "barcodeNumber",
    ];

    const body = format(R.pick(allowedFields, user));

    return fetch(`${uri}/users/${user.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.error);
    });
  },
  deleteUser(userId) {
    return fetch(`${uri}/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  // roles
  addRole(email_address, role) { // eslint-disable-line
    return fetch(`${uri}/roles`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        email_address,
        role,
      }),
    });
  },
  removeRole({ id: roleId }) {
    return fetch(`${uri}/roles/${roleId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  // camps
  getCamps() {
    return fetch(`${uri}/camps`, {
      method: "GET",
      headers: getHeaders(),
    });
  },
  getCamp(campId) {
    return fetch(`${uri}/camps/${campId}`, {
      method: "GET",
      headers: getHeaders(),
    });
  },
  createCamp(body) {
    return fetch(`${uri}/camps`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
  },
  updateCamp(camp) {
    const allowedFields = [
      "busNumber",
      "campus",
      "type",
    ];

    const body = format(R.pick(allowedFields, camp));

    return fetch(`${uri}/camps/${camp.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
  },
  deleteCamp(campId) {
    return fetch(`${uri}/camps/${campId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  // camps
  createItinerary(campId, { location, eventDate, eventTime }) {
    const timePieceIndex = 4;
    const secondsIndex = 2;

    const resetSeconds = R.pipe(
      R.split(" "),
      R.nth(timePieceIndex),
      R.split(":"),
      R.adjust(R.always("00"), secondsIndex),
      R.join(":") // eslint-disable-line
    );

    const newTime = resetSeconds(eventTime.toString());

    const mergeTimeAndDatePieces = R.pipe(
      R.split(" "),
      R.update(timePieceIndex, newTime),
      R.join(" ") // eslint-disable-line
    );

    const event_date = new Date(mergeTimeAndDatePieces(eventDate.toString())).toString(); // eslint-disable-line

    const body = {
      location,
      event_date,
    };

    return fetch(`${uri}/camps/${campId}/itineraries`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
  },
};

module.exports = Api;
