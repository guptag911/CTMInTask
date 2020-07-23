import React, { useState, useEffect } from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import { firebaseAuth, db } from "../../config/config";
import ResponsiveDialog from "./dialog";

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState(null);
  const finalObj = [];

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAllUsersFromDb();
  }, []);

  const getAllUsersFromDb = async () => {
    const data = await db.collection("users").get();
    data.forEach((data) => {
      finalObj.push({
        name: data.data().name,
        email: data.data().email,
        uid: data.id,
      });
    });
    setUsers(finalObj);
    console.log(finalObj);
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs>
          <Typography>Admin Dashboard</Typography>
          <Typography>Admin({firebaseAuth.currentUser.email})</Typography>
        </Grid>
        <Grid item xs>
          {users
            ? users.map((obj) => {
                return (
                  <div>
                    <Typography>
                      ({obj.name}) {obj.email}
                    </Typography>
                    <span>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClickOpen}
                      >
                        Show Analytics
                      </Button>
                    </span>
                    <ResponsiveDialog
                      open={open}
                      handleClose={handleClose}
                      uid={users.uid}
                    />
                  </div>
                );
              })
            : null}
        </Grid>
      </Grid>
    </div>
  );
};

export default Admin;
