import React from 'react'

import { ContextConsumer } from "../context/"

import MuiSlider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

const Slider = () => {
    return (
        <ContextConsumer>
            {(context => (
                <React.Fragment>
                    <h4>Rephrase It</h4>
                    <Tooltip title="Describes how much you want it to change (tradeoff with meaning and grammar)">
                        <span style={{ display: "flex", alignItems: "center" }}>
                            <h6 style={{ display: "inline-block", marginRight: "5px" }}>Strength</h6>
                            <Icon color="disabled" fontSize="small">help_outline</Icon>
                        </span>
                    </Tooltip>
                    <MuiSlider
                        value={context.slider.strength} onChange={context.setSlider}
                        aria-labelledby="strength-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={5}
                    />
                    <Tooltip title="Indicates how heavily you want us to replace words with synonyms">
                        <span style={{ display: "flex", alignItems: "center" }}>
                            <h6 style={{ display: "inline-block", marginRight: "5px" }}>Autoflip</h6>
                            <Icon color="disabled" fontSize="small">help_outline</Icon>
                        </span>
                    </Tooltip>
                    <MuiSlider
                        value={context.slider.autoflip} onChange={context.setSlider}
                        aria-labelledby="autoflip-slider"
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks
                        min={0.0}
                        max={0.99}
                    />
                </React.Fragment>
            ))}
        </ContextConsumer>
    )
}
export default Slider