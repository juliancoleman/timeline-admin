import React from "react";
import R from "ramda";

import {
  DatePicker,
  DropDownMenu,
  FlatButton,
  MenuItem,
  RaisedButton,
  Subheader,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TextField,
  TimePicker,
} from "material-ui";

import Api from "../../helpers/Api";

export default class Camp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      camp: {
        busNumber: "",
        type: "",
        campus: "",
      },
      newItinerary: {
        location: "",
        eventDate: new Date(),
        eventTime: new Date(),
      }
    };

    this.updateCamp = this.updateCamp.bind(this);
    this.deleteCamp = this.deleteCamp.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.createItinerary = this.createItinerary.bind(this);
  }

  componentDidMount() {
    Api.getCamp(this.props.match.params.campId)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Unable to retrieve camp");
      })
      .then(camp => this.setState({ camp }));
  }

  deleteCamp() {
    Api.deleteCamp(this.state.camp.id)
      .then(() => this.props.history.push("/camps"));
  }

  updateCamp() {
    Api.updateCamp(this.state.camp)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Unable to update camp");
      })
      .then(camp => {
        this.setState({ camp });
    });
  }

  createItinerary() {
    Api.createItinerary(this.state.camp.id, this.state.newItinerary)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Unable to create Itinerary");
      })
      .then(itinerary => console.log(itinerary));
  }

  handleInputChange({ target }) {
    const { type, checked, value, name } = target;
    const updatedFieldValue = type === "checkbox" ? checked : value;
    const fieldLens = R.lensProp(name);

    this.setState({
      camp: R.set(fieldLens, updatedFieldValue, this.state.camp),
    });
  }

  handleTypeChange = (event, index, value) => {
    const typeLens = R.lensProp("type");

    this.setState({
      camp: R.set(typeLens, value, this.state.camp),
    });
  }

  handleCampusChange = (event, index, value) => {
    const campusLens = R.lensProp("campus");

    this.setState({
      camp: R.set(campusLens, value, this.state.camp),
    });
  }

  handleLocationChange({ target }) {
    const { type, checked, value, name } = target;
    const updatedFieldValue = type === "checkbox" ? checked : value;
    const fieldLens = R.lensProp(name);

    this.setState({
      newItinerary: R.set(fieldLens, value, this.state.newItinerary),
    });
  }

  handleDateChange = (event, date) => {
    const dateLens = R.lensProp("eventDate");

    this.setState({
      newItinerary: R.set(dateLens, date, this.state.newItinerary),
    });
  }

  handleTimeChange = (event, date) => {
    const timeLens = R.lensProp("eventTime");

    this.setState({
      newItinerary: R.set(timeLens, date, this.state.newItinerary),
    });
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <div>
          <Subheader className="Subheader__flush-left">Camp information</Subheader>
          <TextField
            style={{ marginRight: 12 }}
            floatingLabelText="Bus number"
            name="busNumber"
            type="number"
            value={this.state.camp.busNumber}
            onChange={this.handleInputChange}
          />
          <DropDownMenu
            value={this.state.camp.campus} style={{ verticalAlign: "-81%" }}
            onChange={this.handleCampusChange}
          >
            <MenuItem value="North" primaryText="North" />
            <MenuItem value="Fig Garden" primaryText="Fig Garden" />
            <MenuItem value="Southeast" primaryText="Southeast" />
          </DropDownMenu>
          <DropDownMenu
            value={this.state.camp.type} style={{ verticalAlign: "-81%" }}
            onChange={this.handleTypeChange}
          >
            <MenuItem value="K-2" primaryText="K-2" />
            <MenuItem value="3-6" primaryText="3-6" />
          </DropDownMenu>
        </div>

        <FlatButton
          primary
          label="delete"
          onTouchTap={this.deleteCamp}
          style={{ marginRight: 12 }}
        />
        <RaisedButton
          primary
          label="update"
          onTouchTap={this.updateCamp}
        />

        <Subheader className="Subheader__flush-left">Itineraries</Subheader>
        <TextField
          style={{ marginRight: 12 }}
          floatingLabelText="Location"
          name="location"
          type="string"
          onChange={this.handleLocationChange}
        />
        <DatePicker
          style={{ marginRight: 12, display: "inline-block" }}
          floatingLabelText="Event date"
          container="inline"
          value={this.state.newItinerary.eventDate}
          onChange={this.handleDateChange}
        />
        <TimePicker
          style={{ marginRight: 12, display: "inline-block" }}
          floatingLabelText="Event time"
          format="24hr"
          value={this.state.newItinerary.eventTime}
          onChange={this.handleTimeChange}
        />
        <RaisedButton
          primary
          label="create"
          onTouchTap={this.createItinerary}
        />
      </div>
    );
  }
}
