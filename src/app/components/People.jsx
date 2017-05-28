import React from "react";

import {
  Card,
  CardTitle,
  CardText,
  CardActions,
  FlatButton,
  FloatingActionButton,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from "material-ui";

import ContentAdd from "material-ui/svg-icons/content/add";

import Api from "../../helpers/Api";
import CreatePersonDialog from "./CreatePersonDialog";

export default class People extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      sort: "first_name",
      pageSize: 25,
      page: 1,
      tableHeaders: [
        { key: 1, header: "id", title: "id" },
        { key: 2, header: "firstName", title: "First name" },
        { key: 3, header: "lastName", title: "Last name" },
        { key: 4, header: "campus", title: "Campus" },
        { key: 5, header: "barcodeNumber", title: "Barcode number" },
      ],
      dialogOpen: false,
    };

    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
  }

  componentDidMount() {
    const { sort, pageSize, page } = this.state;

    Api.getUsers({ sort, pageSize, page })
      .then(response => this.setState({ people: response.users }));
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  handleDialogSubmit(user) {
    console.log(user);

    return () => Api.createUser(user)
      .then(response => response.json())
      .then((createdUser) => {
        this.setState({ dialogOpen: false }, () => this.props.history.push(`/person/${createdUser.id}`));
      });
  }

  render() {
    return (
      <div>
        <Card style={{ margin: 8 }}>
          <CardTitle title="People" />
          <CardText>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  {this.state.tableHeaders.map(header => (
                    <TableHeaderColumn key={header.key}>{header.title}</TableHeaderColumn>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.people.map(person => (
                  <TableRow key={person.id} onTouchTap={() => this.props.history.push(`/person/${person.id}`)}>
                    {this.state.tableHeaders.map(header => (
                      <TableRowColumn key={header.key}>
                        {person[header.header]}
                      </TableRowColumn>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardText>
          <CardActions>
            <FlatButton primary label="prev" />
            <FlatButton primary label="next" />
          </CardActions>
        </Card>

        <CreatePersonDialog
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
