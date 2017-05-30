import React from "react";
import R from "ramda";

import {
  Dialog,
  DropDownMenu,
  FlatButton,
  MenuItem,
  TextField,
} from "material-ui";

export default class CreateCampDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "",
      campus: "",
      bus_number: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleCampusChange = (event, index, value) => this.setState({ campus: value });
  handleTypeChange = (event, index, value) => this.setState({ type: value });
  handleInputChange({ target }) {
    const { type, checked, value, name } = target;
    const updatedFieldValue = type === "checkbox" ? checked : value;

    this.setState({
      [name]: updatedFieldValue,
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
        title="Create camp"
        actions={actions}
        modal
        open={this.props.dialogOpen || false}
      >
        <div>
          <TextField
            name="bus_number"
            type="number"
            floatingLabelText="Bus number"
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <DropDownMenu value={this.state.campus} onChange={this.handleCampusChange}>
            <MenuItem value="North" primaryText="North" />
            <MenuItem value="Fig Garden" primaryText="Fig Garden" />
            <MenuItem value="Southeast" primaryText="Southeast" />
          </DropDownMenu>
          <DropDownMenu value={this.state.type} onChange={this.handleTypeChange}>
            <MenuItem value="K-2" primaryText="K-2" />
            <MenuItem value="3-6" primaryText="3-6" />
          </DropDownMenu>
        </div>
      </Dialog>
    );
  }
}
