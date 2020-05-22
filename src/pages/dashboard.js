import React, { useState } from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";

const Dashboard = () => {
  return (
    <div>
      <NavigationBar />
      <Container maxWidth="lg">
        <TabView></TabView>
      </Container>
    </div>
  );
};

export default Dashboard;
