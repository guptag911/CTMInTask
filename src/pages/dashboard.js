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
import { CalendarDataSave } from "../api/calendarAPI";

const Dashboard = () => {
  React.useEffect(()=>{
    const data = MessageList();
    const data3 = CalendarDataSave();
  }, []);
  // const data1 = GsuiteDataSave();
  // const data2 = GsuiteDataGet();
  console.log("in dashboard ");
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
