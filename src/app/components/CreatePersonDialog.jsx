import React from "react";
import R from "ramda";

import {
  Dialog,
  DropDownMenu,
  FlatButton,
  MenuItem,
  TextField,
  Toggle,
} from "material-ui";

const rolesList = [
  "Student",
  "Parent",
  "Small Group Leader",
  "Campus Leader",
];

const rolesSet = {
  "Student": false,
  "Parent": false,
  "Small Group Leader": false,
  "Campus Leader": false,
};

const filteredRoles = R.filter(R.flip(R.prop)(rolesSet));

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
    this.handleToggle = this.handleToggle.bind(this);
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

  handleToggle(event, isInputChecked) {
    const { name } = event.target;

    rolesSet[name] = isInputChecked;

    this.setState({
      role: filteredRoles(rolesList),
    });
  }

  render() {
    const style = {
      TextField: {
        width: "48.3%",
        marginRight: 12,
      }
    };

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
        <div>
          <TextField
            name="first_name"
            floatingLabelText="First name"
            style={style.TextField}
            value={this.state.first_name}
            onChange={this.handleInputChange}
          />
          <TextField
            name="last_name"
            floatingLabelText="Last name"
            style={style.TextField}
            value={this.state.last_name}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <TextField
            name="email_address"
            floatingLabelText="Email address"
            style={style.TextField}
            value={this.state.email_address}
            onChange={this.handleInputChange}
            hintText="student_barcode@email.com"
          />
          <TextField
            name="barcode_number"
            floatingLabelText="Barcode number"
            type="number"
            style={style.TextField}
            value={this.state.barcode_number}
            onChange={this.handleInputChange}
          />
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ marginTop: 18, width: "50%" }}>
            <Toggle
              name="Student"
              label="Student"
              onToggle={this.handleToggle}
            />
            <Toggle
              name="Parent"
              label="Parent"
              onToggle={this.handleToggle}
            />
            <Toggle
              name="Small Group Leader"
              label="Small Group Leader"
              onToggle={this.handleToggle}
            />
            <Toggle
              name="Campus Leader"
              label="Campus Leader"
              onToggle={this.handleToggle}
            />
          </div>
          <DropDownMenu value={this.state.campus} onChange={this.handleCampusChange}>
            <MenuItem value="North" primaryText="North" />
            <MenuItem value="Fig Garden" primaryText="Fig Garden" />
            <MenuItem value="Southeast" primaryText="Southeast" />
          </DropDownMenu>
        </div>
      </Dialog>
    );
  }
}
