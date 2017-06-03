import React from "react";
import R from "ramda";
import string from "underscore.string";

import {
  Card,
  CardText,
  CardTitle,
  DropDownMenu,
  FlatButton,
  IconButton,
  IconMenu,
  List,
  ListItem,
  MenuItem,
  RaisedButton,
  Subheader,
  TextField,
  Toggle,
} from "material-ui";

import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

import Api from "../../helpers/Api";

export default class Person extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: [],
      isChecking: false,
      rolesSet: {
        "Student": false,
        "Parent": false,
        "Small Group Leader": false,
        "Campus Leader": false,
        "Admin": false,
      },
      enrolledCamps: [],
      unenrolledCamps: [],
    };

    this.getUser = this.getUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.getUserCamps = this.getUserCamps.bind(this);
    this.addUserToCamp = this.addUserToCamp.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);

  }

  componentDidMount() {
    this.getUser();
    this.getUserCamps(true);
    this.getUserCamps(false);
  }

  getUser() {
    Api.getUser(this.props.match.params.userId)
      .then((person) => {
        person.roles.forEach(({ name }) => {
          const roleLens = R.lensProp(name);
          this.setState({
            rolesSet: R.set(roleLens, true, this.state.rolesSet),
          });
        });

        this.setState({ person });
      });
  }

  deleteUser() {
    Api.deleteUser(this.props.match.params.userId)
      .then(() => this.props.history.push("/people"));
  }

  updateUser() {
    Api.updateUser(this.state.person)
      .then((person) => {
        this.setState({ person });
      });
  }

  getUserCamps(enrolled) {
    const campType = enrolled ? "enrolledCamps" : "unenrolledCamps";

    Api.getUserCamps(this.props.match.params.userId, enrolled)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Unable to get user Camps");
      })
      .then(camps => this.setState(R.objOf(campType, camps)));
  }

  addUserToCamp(campId, roleName) {
    Api.addUserToCamp(this.props.match.params.userId, campId, roleName)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Unable to get user Camps");
      })
      .then(camp => this.setState({
        unenrolledCamps: R.reject(R.propEq("id", camp.id), this.state.unenrolledCamps),
        enrolledCamps: R.append(camp, this.state.enrolledCamps),
      }));
  }

  handleInputChange({ target }) {
    const { type, checked, value, name } = target;
    const updatedFieldValue = type === "checkbox" ? checked : value;
    const fieldLens = R.lensProp(name);

    this.setState({
      person: R.set(fieldLens, updatedFieldValue, this.state.person),
    });
  }

  handleCampusChange = (event, index, value) => {
    const campusLens = R.lensProp("campus");

    this.setState({
      person: R.set(campusLens, value, this.state.person)
    });
  }

  handleToggle(event, isInputChecked) {
    const { name } = event.target;
    const { roles } = this.state.person;
    const isSelectedRole = R.propEq("name", name);
    const role = R.find(isSelectedRole, roles);

    this.setState({ isChecking: true }, () => {
      const rolesLens = R.lensProp("roles");
      const rolesSetLens = R.lensProp(name);
      const { person, rolesSet } = this.state;

      if (role) {
        Api.removeRole(role)
          .then(() => this.setState({
            isChecking: false,
            person: R.over(rolesLens, R.reject(isSelectedRole), person),
            rolesSet: R.set(rolesSetLens, false, rolesSet),
          }))
          .catch(err => this.setState({ isChecking: false }));
      } else {
        const personRoles = R.view(rolesLens, person);

        Api.addRole(this.state.person.emailAddress, name)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }

            throw new Error("Unable to add role");
          })
          .then((newRole) => {
            this.setState({
              isChecking: false,
              person: R.set(rolesLens, R.append(newRole, personRoles), person),
              rolesSet: R.set(rolesSetLens, true, rolesSet),
            });
          })
          .catch(err => this.setState({ isChecking: false }));
      }
    });
  }

  render() {
    const { rolesSet, enrolledCamps, unenrolledCamps } = this.state;
    const iconButtonElement = (
      <IconButton
        tooltip="Choose role"
        tooltipPosition="bottom-center"
      >
        <MoreVertIcon />
      </IconButton>
    );

    const filteredRoles = R.reject(R.equals("Admin"), R.keys(R.filter(R.identity, rolesSet)));

    return (
      <div style={{ padding: 24 }}>
        <Subheader className="Subheader__flush-left">Basic information</Subheader>

        <div style={{ display: "flex" }}>
          <TextField
            style={{ flexGrow: 1, marginRight: 12 }}
            value={this.state.person.firstName || ""}
            floatingLabelText="First name"
            name="firstName"
            onChange={this.handleInputChange}
          />
          <TextField
            style={{ flexGrow: 1, marginRight: 12 }}
            value={this.state.person.lastName || ""}
            floatingLabelText="Last name"
            name="lastName"
            onChange={this.handleInputChange}
          />
          <TextField
            style={{ flexGrow: 1, marginRight: 12 }}
            value={this.state.person.barcodeNumber || ""}
            type="number"
            floatingLabelText="Barcode number"
            name="barcodeNumber"
            onChange={this.handleInputChange}
          />
          <DropDownMenu value={this.state.person.campus || ""} style={{ marginTop: 16 }} onChange={this.handleCampusChange}>
            <MenuItem value="North" primaryText="North" />
            <MenuItem value="Fig Garden" primaryText="Fig Garden" />
            <MenuItem value="Southeast" primaryText="Southeast" />
          </DropDownMenu>
        </div>

        <div style={{ display: "flex" }}>
          <TextField
            style={{ flexGrow: 3, marginRight: 12 }}
            value={this.state.person.homeAddress || ""}
            floatingLabelText="Home address"
            name="homeAddress"
            onChange={this.handleInputChange}
          />
          <TextField
            style={{ flexGrow: 1, marginRight: 12 }}
            value={this.state.person.emailAddress || ""}
            floatingLabelText="Email address"
            name="emailAddress"
            onChange={this.handleInputChange}
          />
          <TextField
            style={{ flexGrow: 1 }}
            value={this.state.person.phoneNumber || ""}
            floatingLabelText="Phone number"
            name="phoneNumber"
            onChange={this.handleInputChange}
          />
        </div>

        <TextField
          fullWidth
          value={this.state.person.allergies || ""}
          floatingLabelText="Allergies"
          name="allergies"
          onChange={this.handleInputChange}
        />

        <Subheader>Emergency contact information</Subheader>

        <div style={{ display: "flex" }}>
          <TextField
            style={{ flexGrow: 3, marginRight: 12 }}
            value={this.state.person.emergencyContactName || ""}
            floatingLabelText="Emergency contact name"
            name="emergencyContactName"
            onChange={this.handleInputChange}
          />
          <TextField
            style={{ flexGrow: 1, marginRight: 12 }}
            value={this.state.person.emergencyContactNumber || ""}
            floatingLabelText="Emergency contact number"
            name="emergencyContactNumber"
            onChange={this.handleInputChange}
          />
          <TextField
            style={{ flexGrow: 1 }}
            value={this.state.person.emergencyContactRelationship || ""}
            floatingLabelText="Emergency contact relationship"
            name="emergencyContactRelationship"
            onChange={this.handleInputChange}
          />
        </div>

        <FlatButton
          primary
          label="delete"
          onTouchTap={this.deleteUser}
          style={{ marginRight: 12 }}
        />
        <RaisedButton
          primary
          label="update"
          onTouchTap={this.updateUser}
        />

        <Subheader className="Subheader__flush-left">Roles</Subheader>

        <div style={{ display: "flex" }}>
          <div style={{ marginBottom: 18, width: "50%" }}>
            <Toggle
              name="Student"
              label="Student"
              disabled={this.state.isChecking}
              onToggle={this.handleToggle}
              toggled={this.state.rolesSet["Student"]}
            />
            <Toggle
              name="Parent"
              label="Parent"
              disabled={this.state.isChecking}
              onToggle={this.handleToggle}
              toggled={this.state.rolesSet["Parent"]}
            />
            <Toggle
              name="Small Group Leader"
              label="Small Group Leader"
              disabled={this.state.isChecking}
              onToggle={this.handleToggle}
              toggled={this.state.rolesSet["Small Group Leader"]}
            />
            <Toggle
              name="Campus Leader"
              label="Campus Leader"
              disabled={this.state.isChecking}
              onToggle={this.handleToggle}
              toggled={this.state.rolesSet["Campus Leader"]}
            />
            <Toggle
              name="Admin"
              label="Admin"
              disabled={this.state.isChecking}
              onToggle={this.handleToggle}
              toggled={this.state.rolesSet["Admin"]}
            />
          </div>
        </div>

        {/* Enrolled and Unenrolled Camps */}

        <div style={{ display: "flex" }}>
          <Card style={{ flex: 1, marginRight: 12 }}>
            <CardTitle title="Unenrolled Camps" />
            <CardText>
              <List>
                {unenrolledCamps.map(({ id, busNumber, campus, type }, index) => {
                  const rightIconMenu = (
                    <IconMenu iconButtonElement={iconButtonElement}>
                      {filteredRoles.map((role, idx) => (
                        <MenuItem
                          key={idx + 1}
                          onTouchTap={() => this.addUserToCamp(id, role)}
                        >
                          {role}
                        </MenuItem>
                      ))}
                    </IconMenu>
                  );

                  return (
                    <ListItem
                      key={index + 1}
                      primaryText={`Bus ${busNumber} - ${type} ${campus}`}
                      rightIconButton={rightIconMenu}
                    />
                  );
                })}
              </List>
            </CardText>
          </Card>
          <Card style={{ flex: 1 }}>
            <CardTitle title="Enrolled Camps" />
            <CardText>
              {this.state.enrolledCamps.toString()}
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

