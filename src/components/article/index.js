import React from 'react'
import { Switch, Route } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Seneca from "../../template/seneca"
import Truman from "../../template/truman"

const useStyles = makeStyles((theme) => ({
    border: {
        borderColor: "#ccc",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 0,
    },
    box: {
        height: 50,
        background: "#f4f4f4",
        borderBottom: "1px solid #ccc",
    },
    cardContent: {
        margin: "0 1em",
    }
}));


const Article = () => {
    const classes = useStyles();

    return (
        <Card className={classes.border} variant="outlined">
            <Box id="back-to-top-anchor" className={classes.box} />

            <CardContent className={classes.cardContent}>
                <Switch>
                    <Route path="/truman">
                        <Truman />
                    </Route>
                    <Route path="/seneca">
                        <Seneca />
                    </Route>
                    <Route path="/">
                        <Truman />
                    </Route>
                </Switch>
            </CardContent>
        </Card>
    )
}
export default Article
