import React from 'react'

import { ContextConsumer } from "../context"

import MuiSnackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SnackBar = () => {
    return (
        <ContextConsumer>
            {(context => (
                <MuiSnackbar
                    open={context.error !== ""}
                    autoHideDuration={3000}
                    onClose={context.triggerSnack.bind(this, "")}
                >
                    <Alert onClose={context.triggerSnack.bind(this, "")} severity="error">
                        {context.error}
                </Alert>
                </MuiSnackbar>
            ))}
        </ContextConsumer>
    )
}
export default SnackBar