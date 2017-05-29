import React from "react";

import {
  Card,
  CardActions,
  CardTitle,
  CardText,
  FlatButton,
  TextField,
} from "material-ui";


import Api from "../../helpers/Api";
import AuthService from "../../helpers/AuthService";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email_address: "",
      password: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps() {
    if (AuthService.validateToken()) {
      this.props.history.push("/");
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit() {
    const { email_address, password } = this.state;

    Api.authenticate(email_address, password)
      .then(({ user, token }) => {
        AuthService.setUser(user);
        AuthService.setToken(token);
      })
      .then(() => this.props.history.push("/"));
  }

  render() {
    return (
      <Card className="responsive-card-sm">
        <CardTitle title="Login" />
        <CardText>
          <TextField
            name="email_address"
            floatingLabelText="Email"
            value={this.state.email_address}
            onChange={this.handleInputChange}
            fullWidth
          />
          <TextField
            name="password"
            floatingLabelText="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            fullWidth
            type="password"
          />
        </CardText>
        <CardActions>
          <FlatButton primary label="login" onTouchTap={this.handleSubmit} />
        </CardActions>
      </Card>
    );
  }
}
