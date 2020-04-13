import React from 'react'

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
    border: {
        borderColor: "#ccc",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 0,
    },
}));

const SideBar = () => {
    const classes = useStyles();
    
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Card
                    className={classes.border}
                    style={{
                        height: 150,
                        background: "#f4f4f4",
                    }}
                    variant="outlined"
                ></Card>
            </Grid>
            <Grid item xs={12}>
                <Card
                    className={classes.border}
                    style={{
                        height: 100,
                        background: "#f4f4f4",
                    }}
                    variant="outlined"
                ></Card>
            </Grid>
        </Grid>
    )
}
export default SideBar

