import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    console.log("props is ", props);
    const [checked, setChecked] = React.useState(true);
    const handleChange = (id) => {
        console.log("id is ",id, props.data[id].done);
        props.data[id].done=!props.data[id].done;
        setChecked(!checked);
      };
    // const bull = <span className={classes.bullet}>•</span>;

    return (
        <React.Fragment>
            {props.data ? props.data.map((element) => {
                return (<Card key={element.id} className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Assigned by -- {element.by}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {element.task}
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
                            checked={element.done}
                            color="primary"
                            onChange={()=>handleChange(element.id)}
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
