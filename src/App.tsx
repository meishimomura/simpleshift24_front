import React from "react";
import Default from "./Default";
import { Route, Switch, Redirect } from "react-router-dom";

export default function App() {
  return (
    <Switch>
      <Route exact path="/shift" component={Default} />
      <Route exact path="/staff" component={Default} />
    </Switch>
  );
}
