import React from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";
import {DataSave, GetData, MessageList} from "../api/datagetting_pythonScript";
import { GsuiteDataGet, GsuiteDataSave } from "../api/gsuiteApi";


const Dashboard = () => {
  const data = MessageList();
  // const data1 = GsuiteDataSave();
  // const data2 = GsuiteDataGet();
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
