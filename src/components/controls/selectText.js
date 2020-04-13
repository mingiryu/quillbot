import React from 'react'

import { Context } from "../context/"

import { getPayload } from "../../util/stringHelper"
import { _fetchJSON, fetchJSON } from "../../actions/loadData"
import { updateView, convertDocument } from "../../util/templateConverter"
import { debounce } from "../../util/eventHelper"

import Tooltip from '@material-ui/core/Tooltip';
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

const EditIcon = () => (
    <Tooltip title="REPHRASE IT" placement="top" arrow>
    <Fab color="primary" size="small">
        <CreateRoundedIcon />
    </Fab>
    </Tooltip>
)

class SelectText extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            top: "0px",
            left: "0px",
            range: null,
            progress: false
        }
        this.progress = false
    }

    handleSelect = (event) => {
        if (document.getSelection) {

            let selection = document.getSelection();
            const text = selection.toString().trim();

            if (text && text !== "") {
                const range = selection.getRangeAt(0)
                if (range.commonAncestorContainer.tagName && range.commonAncestorContainer.tagName.toLowerCase() === "div") {
                    this.context.triggerSnack("Please select sentences from a single paragraph.")
                } else if (range.startContainer.parentElement.tagName.toLowerCase() !== "span"){
                } else {
                    const rect = range.endContainer.parentElement.getBoundingClientRect()
                    this.setState({
                        open: true,
                        top: `${rect.top + window.scrollY}px`,
                        left: `${rect.right + window.scrollX}px`,
                        range: range,
                    });
                }
            }
        }
    }

    handleClose = (event) => {
        if (event.target.tagName.toLowerCase() !== "svg" && event.target.tagName.toLowerCase() !== "path") {
            this.setState({ open: false })
            this.context.setTooltip(null)
        }
    }

    handleClick = (event) => {
        this.setState({ progress: true });

        const range = this.state.range;
        const slider = this.context.slider;
        const payload = getPayload(range);

        fetchJSON(payload, slider.strength, slider.autoflip)
            .then((json) => {
                if (json) {
                    updateView(json, range);
                } else {
                    this.context.triggerSnack("Bad request.")
                }
                this.setState({ progress: false, open: false })
            })
    };

    displayTooltip = (event) => {
        if (event.target.alts && event.target.alts.length) {
            const rect = event.target.getBoundingClientRect();
            this.context.setTooltip({
                alts: event.target.alts,
                rect: {
                    top: `${rect.top + window.scrollY + 10}px`,
                    left: `${rect.left + window.scrollX + 10}px`,
                }
            })
        }
    };

    componentDidMount = () => {
        convertDocument()
        document.addEventListener("selectionchange", debounce(this.handleSelect, 250));
        document.addEventListener("mousedown", this.handleClose);
        document.addEventListener("click", this.displayTooltip)
    }

    render() {
        return (
            <Zoom in={this.state.open}>
                <div
                    onClick={this.handleClick}
                    role="presentation"
                    style={{
                        position: "absolute",
                        top: this.state.top,
                        left: this.state.left,
                    }}
                >
                    {this.state.progress ? <CircularProgress /> : <EditIcon />}
                </div>
            </Zoom>
        )
    }
}
SelectText.contextType = Context
export default SelectText