import React from 'react'

import { ContextProvider } from "../context/"

import SnackBar from "./snackBar"
import ScrollTop from "./scrollTop"
import SelectText from "./selectText"
import Tooltip from "./tooltip"

const Controls = () => {
    return (
        <React.Fragment>
            <ContextProvider>
                <SnackBar />
                <ScrollTop />
                <SelectText />
                <Tooltip />
            </ContextProvider>
        </React.Fragment>
    )
}
export default Controls

