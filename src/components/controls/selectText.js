import React from 'react'

import { ContextConsumer } from "../context/"

import { getPayload } from "../../util/stringHelper"
import { _fetchJSON, fetchJSON } from "../../actions/loadData"
import { updateView, convertDocument } from "../../util/templateConverter"
import { debounce } from "../../util/eventHelper"

import Fab from "@material-ui/core/Fab";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import Zoom from "@material-ui/core/Zoom";

const EditIcon = () => (
    <Fab color="primary" size="small">
        <CreateRoundedIcon />
    </Fab>
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
                console.log(text)
                const range = selection.getRangeAt(0)
                if (range.commonAncestorContainer.tagName && range.commonAncestorContainer.tagName.toLowerCase() === "div") {
                    this.context.triggerSnack("Please hightlight within a single paragraph.")
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
        }
    }

    handleClick = (event) => {
        this.setState({ progress: true });

        const range = this.state.range;
        const payload = getPayload(range);

        _fetchJSON(payload)
            .then((json) => {
                if (json) {
                    updateView(json, range);
                } else {
                    this.context.triggerSnack("Invalid request.")
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
                    left: `${rect.left + window.scrollX}px`,
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
SelectText.contextType = ContextConsumer
export default SelectText