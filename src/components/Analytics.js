import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
// import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles({
    fullList: {
        width: 'auto',
        height: 'auto'
    },
});

export default function TemporaryDrawer() {

    const classes = useStyles();

    return (
        <div className={classes.fullList} style={{"backgroundColor":"red"}}>
            <p>Hello world</p>
        </div>
    );

}
