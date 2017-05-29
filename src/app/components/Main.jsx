import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import {
  AppBar,
  Divider,
  Drawer,
  MenuItem,
  Subheader,
} from "material-ui";

import Home from "material-ui/svg-icons/action/home";
import People from "material-ui/svg-icons/social/people";
import PersonPin from "material-ui/svg-icons/maps/person-pin";
import Lock from "material-ui/svg-icons/action/lock";

import AuthService from "../../helpers/AuthService";

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      drawerOpen: false,
    };

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleDrawerToggle() {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }
  handleDrawerClose() {
    this.setState({ drawerOpen: false });
  }

  render() {
    return (
      <div style={{ height: "100vh" }}>
        <AppBar
          title={<span>Summerpalooza <small>Admin</small></span>}
          titleStyle={{ fontSize: 20 }}
          onLeftIconButtonTouchTap={this.handleDrawerToggle}
          showMenuIconButton={AuthService.validateToken()}
        />

        <Drawer
          open={this.state.drawerOpen}
          docked={false}
          onRequestChange={open => this.setState({ drawerOpen: open })}
        >
          <NavLink exact to="/" activeClassName="active">
            <MenuItem
              primaryText="Home"
              onTouchTap={this.handleDrawerClose}
              leftIcon={<Home />}
            />
          </NavLink>
          <NavLink exact to="/people" activeClassName="active">
            <MenuItem
              primaryText="People"
              onTouchTap={this.handleDrawerClose}
              leftIcon={<People />}
            />
          </NavLink>
          <NavLink exact to="/camps" activeClassName="active">
            <MenuItem
              primaryText="Camps"
              onTouchTap={this.handleDrawerClose}
              leftIcon={<PersonPin />}
            />
          </NavLink>
          <NavLink exact to="/login" activeClassName="active" onTouchTap={() => AuthService.logout()}>
            <MenuItem
              primaryText="Logout"
              onTouchTap={this.handleDrawerClose}
              leftIcon={<Lock />}
            />
          </NavLink>

          <Divider />

          <Subheader>&copy; 2017 Julian Coleman</Subheader>
        </Drawer>

        {this.props.children}
      </div>
    );
  }
}

Main.propTypes = {
  children: PropTypes.element.isRequired,
};
