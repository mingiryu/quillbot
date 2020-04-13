import React from 'react'

import { ContextConsumer } from "../context/"

import { withStyles } from "@material-ui/core/styles";
import MuiTooltip from "@material-ui/core/Tooltip";

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        fontSize: 12,
        fontFamily: "Montserrat, sans-serif",
        borderRadius: 0,
        color: "black",
        background: "white",
        border: "1px solid rgba(0, 0, 255, .2)",
        boxShadow: "6px 6px 1px 0.5px rgba(0, 0, 255, .2)",
    },
}))(MuiTooltip);

const Tooltip = () => {
    return (
        <ContextConsumer>
            {context => {
                if (!context.tooltip) return;

                return (<HtmlTooltip
                    open={context.tooltip}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement="bottom-start"
                    style={{ ...context.tooltip.rect, position: "absolute" }}
                    title={
                        <React.Fragment>
                            {context.tooltip.alts.slice(0, 7).map((alt) => (
                                <span key={alt} style={{ display: "block" }}>
                                    {alt}
                                </span>
                            ))}
                        </React.Fragment>
                    }
                >
                    <span />
                </HtmlTooltip>)
            }}
        </ContextConsumer>
    )
}
export default Tooltip
