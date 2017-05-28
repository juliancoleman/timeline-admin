import React from "react";

import {
  Dialog,
  DropDownMenu,
  FlatButton,
  MenuItem,
  TextField,
} from "material-ui";

export default class CreatePersonDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      campus: "North",
      email_address: "",
      barcode_number: "",
      role: [],
      password: "12345678",
      confirm_password: "12345678",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleCampusChange = (event, index, value) => this.setState({ campus: value });
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.props.handleDialogClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={this.props.handleDialogSubmit(this.state)}
      />,
    ];

    return (
      <Dialog
        title="Create person"
        actions={actions}
        modal
        open={this.props.dialogOpen || false}
      >
        <TextField
          name="first_name"
          floatingLabelText="First name"
          value={this.state.first_name}
          onChange={this.handleInputChange}
        />
        <TextField
          name="last_name"
          floatingLabelText="Last name"
          value={this.state.last_name}
          onChange={this.handleInputChange}
        />
        <DropDownMenu value={this.state.campus} onChange={this.handleCampusChange}>
          <MenuItem value="North" primaryText="North" />
          <MenuItem value="Fig Garden" primaryText="Fig Garden" />
          <MenuItem value="Southeast" primaryText="Southeast" />
        </DropDownMenu>
        <TextField
          name="email_address"
          floatingLabelText="Email address"
          value={this.state.email_address}
          onChange={this.handleInputChange}
          hintText="student_barcode@email.com"
        />
        <TextField
          name="barcode_number"
          floatingLabelText="Barcode number"
          value={this.state.barcode_number}
          onChange={this.handleInputChange}
        />
      </Dialog>
    );
  }
}
