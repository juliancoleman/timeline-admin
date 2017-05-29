import React from "react";

import {
  Card,
  CardTitle,
  CardText,
} from "material-ui";

const NotFound = () => (
  <Card className="responsive-card-sm">
    <CardTitle title="Dang it &#9785;" />
    <CardText>
      That page could not be found.
    </CardText>
  </Card>
);

export default NotFound;
