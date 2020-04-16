import React from 'react'

import { ContextConsumer } from "../context/"

import { withStyles } from "@material-ui/core/styles";
import MuiTooltip from "@material-ui/core/Tooltip";

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        fontSize: 12,
        fontFamily: "Montserrat, sans-serif",
        color: "black",
        background: "white",
        border: "0.1px solid lightgray",
        boxShadow: "10px 20px 50px 5px lightgray;",
    },
    arrow: {
        color: "white",
    }
}))(MuiTooltip);

const Tooltip = () => {
    return (
        <ContextConsumer>
            {context => {
                if (!context.tooltip) return;

                return (
                    <HtmlTooltip
                        arrow
                        open={context.tooltip != null}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="bottom-start"
                        style={{ ...context.tooltip.rect, position: "absolute" }}
                        title={
                            <React.Fragment>
                                {context.tooltip.alts.map((alt) => (
                                    <span key={alt} style={{ display: "block" }}>
                                        {alt}
                                    </span>
                                ))}
                            </React.Fragment>
                        }
                    ><span /></HtmlTooltip>
                )
            }}
        </ContextConsumer>
    )
}
export default Tooltip
