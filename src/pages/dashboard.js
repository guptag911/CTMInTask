import React from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";
// import { ListLabels } from "../api/gmailApi";
import {DataSave, GetData, ListOfLabels} from "../api/testdatasave";

const Dashboard = () => {
  // const data = ListOfLabels();
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
