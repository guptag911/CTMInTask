import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { GsuiteDataGet, GsuiteDataSave } from "../api/gsuiteApi";

const useStyles = makeStyles({
    root: {
        maxWidth: '30%',
        margin: 20,
        float: 'left',
        display: 'inline-block'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});


export default function SimpleCard(props) {
    const classes = useStyles();

    // console.log("props is ", props);

    let [data , getData] = useState([]);
    const [checked, setChecked] = useState(true);
    useEffect(() => { 
         GsuiteDataGet().then((data)=>{
            getData(data);
         }).catch((err)=>{
            console.log("err is ", err);
         });
    }, []);

    const handleChange = (mid, element) => {
        element.taskid=null;
        element.status=true;
        GsuiteDataSave(mid, element).then((data)=>{
            GsuiteDataGet().then((resp)=>{
                getData(resp);
            })
        })
    };
    // const bull = <span className={classes.bullet}>•</span>;

    return (
        <React.Fragment>
            {data ? data.map((element) => {
                return !element.taskid && element.status ? null: (  <Card key={element.mid} className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Assigned by -- {element.sender}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {element.task_desc}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            adjective
                </Typography>
                        <Typography variant="body2" component="p">
                            well meaning and kindly.
                  <br />
                            {'"a benevolent smile"'}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!element.taskid && element.status}
                                    color="primary"
                                    onChange={() => handleChange(element.mid, element)}
                                />
                            }
                            label="Completed"
                        />

                    </CardContent>
                    <CardActions>
                        <a href={element.url} style={{ textDecoration: 'none' }} size="small">Go to the task</a>
                    </CardActions>
                </Card>)
            }) : null}

        </React.Fragment>
    );
}
