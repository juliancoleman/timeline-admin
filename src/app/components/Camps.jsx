import React from "react";

import {
  Card,
  CardTitle,
  CardActions,
  FlatButton,
  FloatingActionButton,
  Subheader,
} from "material-ui";

import ContentAdd from "material-ui/svg-icons/content/add";

import Api from "../../helpers/Api";
import CreateCampDialog from "./CreateCampDialog";

export default class Camps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      camps: [],
      dialogOpen: false,
    };

    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
  }

  componentDidMount() {
    Api.getCamps()
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Unable to retrieve camps");
      })
      .then(camps => this.setState({ camps }));
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  handleDialogSubmit(camp) {
    return () => Api.createCamp(camp)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error("Unable to create camp");
      })
      .then(camp => {
        this.setState({ dialogOpen: false }, () => {
          this.props.history.push(`/camp/${camp.id}`);
        });
      });
  }

  render() {
    const { camps } = this.state;

    return (
      <div>
        {!camps.length > 0 && (
          <Subheader style={{ display: "flex", justifyContent: "center" }}>
            No camps yet. Click the Floating Action Button below to create one!
          </Subheader>
        )}

        <div className="flex-grid">
          {camps.map(({ id, type, campus, busNumber }) => (
            <Card key={id}>
              <CardTitle title={campus} subtitle={`${type} - Bus ${busNumber}`} />
              <CardActions>
                <FlatButton label="view" onTouchTap={() => this.props.history.push(`/camp/${id}`)} />
              </CardActions>
            </Card>
          ))}
        </div>

        <CreateCampDialog
          dialogOpen={this.state.dialogOpen}
          handleDialogClose={this.handleDialogClose}
          handleDialogSubmit={this.handleDialogSubmit}
        />

        <FloatingActionButton
          style={{ position: "fixed", bottom: 24, right: 24 }}
          onTouchTap={this.handleDialogOpen}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
