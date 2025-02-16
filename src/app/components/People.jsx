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
      pageSize: 15,
      page: 1,
      dialogOpen: false,
      paginationData: {
        page: 1,
        pageCount: 1,
        pageSize: 15,
        rowCount: 1,
      },
      tableHeaders: [
        { key: 1, header: "firstName", title: "First name" },
        { key: 2, header: "lastName", title: "Last name" },
        { key: 3, header: "campus", title: "Campus" },
        { key: 4, header: "barcodeNumber", title: "Barcode number" },
        { key: 4, header: "emailAddress", title: "Email address" },
      ],
    };

    this.getUsers = this.getUsers.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
  }

  componentDidMount() {
    const { page } = this.state;

    this.getUsers(page);
  }

  getUsers(page) {
    Api.getUsers(this.state.pageSize, page)
      .then(({ users: people, paginationData }) => this.setState({
        people,
        paginationData,
      }));
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  handleDialogSubmit(user) {
    return () => Api.createUser(user)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return alert("Unable to create person. Please verify form fields and try again");
      })
      .then((createdUser) => {
        this.setState({ dialogOpen: false }, () => {
          this.props.history.push(`/person/${createdUser.id}`);
        });
      });
  }

  render() {
    const { rowCount, page, pageCount } = this.state.paginationData;

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
            <FlatButton
              primary
              label="prev"
              disabled={page === 1}
              onTouchTap={() => this.getUsers(page - 1)}
            />
            <FlatButton
              primary
              label="next"
              disabled={page === pageCount}
              onTouchTap={() => this.getUsers(page + 1)}
            />
            <span>page {page} of {pageCount} : {rowCount} people</span>
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
