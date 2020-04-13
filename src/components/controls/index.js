import React from 'react'

import { ContextProvider } from "../context/"

import SnackBar from "./snackBar"
import ScrollTop from "./scrollTop"
import SelectText from "./selectText"
import Tooltip from "./tooltip"
import Slider from "./slider"

const Controls = () => {
    return (
        <React.Fragment>
            <ContextProvider>
                <SnackBar />
                <ScrollTop />
                <SelectText />
                <Tooltip />
                <Slider />
            </ContextProvider>
        </React.Fragment>
    )
}
export default Controls

