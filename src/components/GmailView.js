import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '10%',
        flexShrink: 0,
        marginRight:"2%"
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        marginRight:"2%",
        width: "200px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    descpHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        width: "500px"
    },
    
}));

export default function ControlledExpansionPanels() {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    let arr=[1,2,3,4,5];

    return (
        <div className={classes.root}>
            {arr.map((ele) => {
                return <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>General settings</Typography>
                    <Typography className={classes.secondaryHeading}>I am an expansion panel - </Typography>
                    <Typography className={classes.descpHeading}> I am an expansion panel. Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                        maximus est, id dignissim quam. Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                        maximus est, id dignissim quam.</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                        maximus est, id dignissim quam.
          </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            })}
            
        </div>
    );
}
