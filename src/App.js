import React from "react";
import { HashRouter } from "react-router-dom";

import "./App.css";
import NavBar from "./components/navBar/"
import SideBar from "./components/sideBar/"
import Article from "./components/article/";
import Controls from "./components/controls/"

import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 70,
        marginBottom: 0,
    },
}));

const App = (props) => {
    const classes = useStyles();
    const matches = useMediaQuery("(min-width:900px)");

    return (
        <React.Fragment>
            <NavBar />
            <Controls />

            <HashRouter>
                <Container className={classes.container}>
                    <Grid container justify="center" spacing={4}>
                        <Grid item xs={matches ? 7 : 12}>
                            <Article />
                        </Grid>
                        <Grid item xs={matches ? 3 : 12}>
                            <SideBar />
                        </Grid>
                    </Grid>
                </Container>
            </HashRouter>
        </React.Fragment>
    );
}
export default App;
