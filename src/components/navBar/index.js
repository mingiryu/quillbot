import React from 'react'

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";

const useStyles = makeStyles((theme) => ({
    appBar: {
        display: "flex",
        flexDirection: "row",
        height: 50,
        boxShadow: "0 1px 0 0 #fff",
        backgroundColor: "#084466",
    }
}))

const NavBar = () => {
    const classes = useStyles()
    return (
        <AppBar className={classes.appBar} position="static"></AppBar>
    )
}
export default NavBar

