import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import "./App.css";
import Article from "./comps/Article";

import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles((theme) => ({
    appBar: {
        display: "flex",
        flexDirection: "row",
        height: 50,
        boxShadow: "0 1px 0 0 #fff",
        backgroundColor: "#084466",
    },
    container: {
        paddingTop: 70,
        marginBottom: 0,
    },
    border: {
        borderColor: "#ccc",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 0,
    },
    scrollToTop: {
        position: "fixed",
        bottom: theme.spacing(3),
        left: theme.spacing(3),
    },
}));

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#back-to-top-anchor"
        );

        if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <Zoom in={trigger}>
            <div
                onClick={handleClick}
                role="presentation"
                className={classes.scrollToTop}
            >
                {children}
            </div>
        </Zoom>
    );
}

function App(props) {
    const classes = useStyles();
    const matches = useMediaQuery("(min-width:900px)");

    return (
        <React.Fragment>
            <AppBar className={classes.appBar} position="static"></AppBar>

            <Container className={classes.container}>
                <Grid container justify="center" spacing={4}>
                    <Grid item xs={matches ? 7 : 12}>
                        <Card className={classes.border} variant="outlined">
                            <Box
                                id="back-to-top-anchor"
                                style={{
                                    height: 50,
                                    background: "#f4f4f4",
                                    borderBottom: "1px solid #ccc",
                                }}
                            ></Box>

                            <CardContent
                                style={{
                                    margin: "0 1em",
                                }}
                            >
                                <HashRouter>
                                    <Switch>
                                        <Route path="/Seneca">
                                            <Article render="Seneca" />
                                        </Route>
                                        <Route path="/">
                                            <Article render="Truman"/>
                                        </Route>
                                    </Switch>
                                </HashRouter>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={matches ? 3 : 12}>
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
                    </Grid>
                </Grid>
            </Container>

            <ScrollTop {...props}>
                <Fab
                    color="primary"
                    size="small"
                    aria-label="scroll back to top"
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </React.Fragment>
    );
}

export default App;
