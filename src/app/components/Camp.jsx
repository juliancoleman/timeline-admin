import React from "react";
import R from "ramda";

import {
  DatePicker,
  DropDownMenu,
  FlatButton,
  IconButton,
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

import HighlightOff from "material-ui/svg-icons/action/highlight-off";

import Api from "../../helpers/Api";

export default class Camp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      camp: {
        busNumber: "",
        type: "",
        campus: "",
        itineraries: [],
      },
      newItinerary: {
        location: "",
        eventDate: new Date(),
        eventTime: new Date(),
      }
    };

    this.getCamp = this.getCamp.bind(this);
    this.updateCamp = this.updateCamp.bind(this);
    this.deleteCamp = this.deleteCamp.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.createItinerary = this.createItinerary.bind(this);
    this.deleteItinerary = this.deleteItinerary.bind(this);
  }

  componentDidMount() {
    this.getCamp()
      .then(camp => this.setState({ camp }));
  }

  getCamp() {
    return Api.getCamp(this.props.match.params.campId)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Unable to retrieve camp");
      });
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
      .then(() => {
        this.getCamp()
          .then(camp => this.setState({ camp }));
      });
  }

  deleteItinerary(itineraryId) {
    Api.deleteItinerary(itineraryId)
      .then(() => {
        this.getCamp()
          .then(camp => this.setState({ camp }));
      })
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
    const { camp, newItinerary } = this.state;

    return (
      <div style={{ padding: 24 }}>
        <div>
          <Subheader className="Subheader__flush-left">Camp information</Subheader>
          <TextField
            style={{ marginRight: 12 }}
            floatingLabelText="Bus number"
            name="busNumber"
            type="number"
            value={camp.busNumber}
            onChange={this.handleInputChange}
          />
          <DropDownMenu
            value={camp.campus} style={{ verticalAlign: "-81%" }}
            onChange={this.handleCampusChange}
          >
            <MenuItem value="North" primaryText="North" />
            <MenuItem value="Fig Garden" primaryText="Fig Garden" />
            <MenuItem value="Southeast" primaryText="Southeast" />
          </DropDownMenu>
          <DropDownMenu
            value={camp.type} style={{ verticalAlign: "-81%" }}
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
          value={newItinerary.eventDate}
          onChange={this.handleDateChange}
        />
        <TimePicker
          style={{ marginRight: 12, display: "inline-block" }}
          floatingLabelText="Event time"
          format="24hr"
          value={newItinerary.eventTime}
          onChange={this.handleTimeChange}
        />
        <RaisedButton
          primary
          label="create"
          onTouchTap={this.createItinerary}
        />

        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Location</TableHeaderColumn>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Time</TableHeaderColumn>
              <TableHeaderColumn>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {camp.itineraries.map(itinerary => {
              const itineraryDate = new Date(itinerary.eventDate);
              const eventDate = `${itineraryDate.getMonth() + 1}/${itineraryDate.getDate()}`;
              const eventTime = `${itineraryDate.getHours()}:${itineraryDate.getMinutes()}`;

              return (
                <TableRow key={itinerary.id}>
                  <TableRowColumn>{itinerary.location}</TableRowColumn>
                  <TableRowColumn>{eventDate}</TableRowColumn>
                  <TableRowColumn>{eventTime}</TableRowColumn>
                  <TableRowColumn>
                    <IconButton onTouchTap={() => this.deleteItinerary(itinerary.id)}>
                      <HighlightOff />
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
