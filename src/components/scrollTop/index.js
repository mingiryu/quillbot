import React from 'react'

import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles((theme) => ({
    scrollTop: {
        position: "fixed",
        bottom: theme.spacing(3),
        left: theme.spacing(3),
    },
}));

const ScrollTop = (props) => {
    const classes = useStyles();

    const trigger = useScrollTrigger({
        target: undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = document.querySelector("#back-to-top-anchor");
        if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <Zoom in={trigger}>
            <Fab
                onClick={handleClick}
                className={classes.scrollTop}

                color="primary"
                size="small"
                aria-label="scroll back to top"
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    )
}
export default ScrollTop

