import React from "react";
import R from "ramda";

import Api from "../../helpers/Api";

export default class Person extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: [],
    };
  }

  componentDidMount() {
    Api.getUser(this.props.match.params.userId)
      .then(person => this.setState({ person }, () => console.warn(this.state.person)));
  }

  render() {
    const keys = R.keys(this.state.person);
    return (
      <div>
        {keys.map((prop, idx) => (
          <div key={idx + 100}>
            <p key={idx + 50}>{prop}</p>
            <p key={idx}>{this.state.person[prop]}</p>
          </div>
        ))}
      </div>
    );
  }
}
