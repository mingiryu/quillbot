import React from "react";
import { Transition } from "react-transition-group";
import Truman from "./truman";

import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import Fab from "@material-ui/core/Fab";

const HtmlTooltip = withStyles(theme => ({
    tooltip: {
        background: "rgba(0,0,0,0)"
    }
}))(Tooltip);

export default class Article extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            rect: { top: "0px", left: "0px" },
            id: "",
            filter: []
        };
    }

    handleTooltipClose = () => {
        this.setState({ open: false });
    };

    handleTooltipOpen = () => {
        this.setState({ open: true });
    };

    handleHighlight = event => {
        if (!this.state.open && window.getSelection) {
            const text = window
                .getSelection()
                .toString()
                .trim();
            if (text && event.target.id != "") {
                this.setState({ id: event.target.id });
                if (this.state.id != "") {
                    this.setState({
                        open: true
                    });
                    const rect = event.target.getBoundingClientRect();
                    this.setState({
                        rect: {
                            top: `${rect.top + window.scrollY}px`,
                            left: `${rect.right + window.scrollX}px`
                        }
                    });
                }
            }
        }
    };

    handleClick = event => {
        let original = document.getElementById(this.state.id);
        let standard = document.getElementById(`s${this.state.id.slice(1)}`);

        if (!this.state.filter.includes(this.state.id)) {
            this.setState({ filter: [...this.state.filter, this.state.id] });
        }
        event.preventDefault();
    };

    componentDidMount() {
        window.addEventListener("mouseup", this.handleHighlight);
        window.addEventListener("mousedown", this.handleTooltipClose);
    }

    render() {
        return (
            <React.Fragment>
                <HtmlTooltip
                    open={this.state.open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    interactive
                    title={
                        <Fab color="primary" size="small">
                            <CreateRoundedIcon onClick={this.handleClick} />
                        </Fab>
                    }
                    style={{ ...this.state.rect, position: "absolute" }}
                >
                    <span />
                </HtmlTooltip>

                <h1>Harry S. Truman: The Truman Doctrine</h1>

                {Truman.map((e, i) => {
                    if (this.state.filter.includes(`o${i}`)) {
                        return <p id={`s${i}`}><b>{e.standard}</b></p>;
                    } else {
                        return <p id={`o${i}`}>{e.original}</p>;
                    }
                })}
                <h6>
                    Source: <i>Congressional Record,</i> 80 Cong., 1 Sess., pp.
                    1980-1981.
                </h6>
            </React.Fragment>
        );
    }
}
