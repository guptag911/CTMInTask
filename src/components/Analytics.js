import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import Chart from "./analyticsChart";

const useStyles = makeStyles({
    fullList: {
        width: 'auto',
        height: 'auto'
    },
});

export default function TemporaryDrawer() {

    const classes = useStyles();

    return (
        <div className={classes.fullList}>
            <Chart></Chart>
        </div>
    );

}
