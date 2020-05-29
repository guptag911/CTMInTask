import React from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";
import {
  DataSave,
  GetData,
  MessageList,
} from "../api/datagetting_pythonScript";
import { GsuiteDataGet, GsuiteDataSave } from "../api/gsuiteApi";
import { CalenderDataSave } from "../api/calenderAPI";

const Dashboard = () => {
  const data = MessageList();
  const data3 = CalenderDataSave();
  // const data1 = GsuiteDataSave();
  // const data2 = GsuiteDataGet();
  return (
    <div>
      <NavigationBar />
      <Container maxWidth="lg" style={{ marginTop: "100px" }}>
        <TabView></TabView>
      </Container>
    </div>
  );
};

export default Dashboard;
