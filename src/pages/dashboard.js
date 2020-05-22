import React from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";

const Dashboard = () => {
  return (
    <div>
      <NavigationBar />
      <Container maxWidth="lg"></Container>
    </div>
  );
};

export default Dashboard;
