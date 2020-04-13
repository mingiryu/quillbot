import React from 'react'

import { ContextProvider } from "../context/"

import SnackBar from "./snackBar"
import SelectText from "./selectText"
import Tooltip from "./tooltip"
import Slider from "./slider"

const Controls = () => {
    return (
        <React.Fragment>
            <ContextProvider>
                <SnackBar />
                <SelectText />
                <Tooltip />
                <Slider />
            </ContextProvider>
        </React.Fragment>
    )
}
export default Controls

