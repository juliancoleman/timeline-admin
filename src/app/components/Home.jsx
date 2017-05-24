import React from "react";

import {
  Card,
  CardTitle,
  CardText,
} from "material-ui";

const Home = () => (
  <div>
    <Card className="responsive-card-md">
      <CardTitle title="Welcome" />
      <CardText>
        Welcome to the Summerpalooza admin panel
      </CardText>
    </Card>
  </div>
);

export default Home;
