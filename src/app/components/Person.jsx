import React from "react";
import R from "ramda";

import {
  RaisedButton,
} from "material-ui";

import Api from "../../helpers/Api";

export default class Person extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: [],
    };

    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    Api.getUser(this.props.match.params.userId)
      .then(person => this.setState({ person }));
  }

  deleteUser() {
    Api.deleteUser(this.props.match.params.userId)
      .then(() => this.props.history.push("/people"));
  }

  render() {
    const keys = R.keys(this.state.person);
    return (
      <div>
        <div>
          {keys.map((prop, idx) => (
            <div key={idx + 100}>
              <p key={idx + 50}>{prop}</p>
              <p key={idx}>{JSON.stringify(this.state.person[prop])}</p>
            </div>
          ))}
        </div>
        <div>
          <RaisedButton
            primary
            label="delete"
            onTouchTap={this.deleteUser}
          />
        </div>
      </div>
    );
  }
}
