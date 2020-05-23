import React from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";
import {DataSave, GetData, MessageList} from "../api/testdatasave";

const Dashboard = () => {
  const data = MessageList();
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
