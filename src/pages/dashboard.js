import React from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";
import { get_data } from "../api/fixedGsuite";
import { delete_tasks, insert_tasks } from "../api/googleTasks";
import { HubSpotTasksGetAPIData } from "../api/hubSpot";

const Dashboard = () => {
  React.useEffect(() => {
    get_data("from: comments-noreply@docs.google.com");
    setTimeout(() => {
      delete_tasks();
      insert_tasks();
      HubSpotTasksGetAPIData();
    }, 5000);
  }, []);

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
