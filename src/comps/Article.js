import React from "react";

import "./Article.css";

import Truman from "./Truman";
import Seneca from "./Seneca";

import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import Fab from "@material-ui/core/Fab";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

const FabTooltip = withStyles((theme) => ({
    tooltip: {
        background: "rgba(0,0,0,0)",
    },
}))(Tooltip);

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
}))(Tooltip);

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const removePunct = (text) => {
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\']/g, "");
};

// getSelection() may return a string with partial words. This ensures that each words are complete.
const getFullString = (range) => {
    let start = range.startContainer.parentElement;
    let end = range.endContainer.parentElement.nextElementSibling;

    // If div:article-paragraph is selected by accident, it defaults to next span element.
    if (start.tagName.toLowerCase() !== "span") {
        start = range.startContainer.nextElementSibling;
    }

    let fullString = [];
    while (start !== end && start) {
        fullString.push(start.innerHTML);
        start = start.nextElementSibling;
    }

    return fullString.join(" ");
};

// For dev and testing
const _fetchQuill = (payload) => {
    console.log({ payload: payload });
    return new Promise(function (resolve, reject) {
        setTimeout(resolve.bind(this, require("./data.json")), 1500);
    });
};

// For production
const fetchQuill = (payload) => {
    console.log({ payload: payload });

    return fetch("https://quillbot.p.rapidapi.com/paraphrase", {
        method: "POST",
        headers: {
            "x-rapidapi-host": "quillbot.p.rapidapi.com",
            "x-rapidapi-key":
                "4e26127674msh44f405456fbb569p15cdd2jsn41c7e4a8bdd5",
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            text: payload,
            numParaphrases: 1,
            coupon: "IJg98DCuPqGuit7BrGXKaWsoqOUz0DYV",
            includeSegs: true,
            strength: 1,
            autoflip: 1.0,
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log({ response: response });
                return null;
            }
        })
        .then((json) => {
            if (json) {
                return json;
            } else {
                console.log({ json: json });
                return null;
            }
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

class Article extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            snackOpen: false,
            fabOpen: false,
            altsOpen: false,
            fabRect: { top: "0px", left: "0px" },
            altsRect: { top: "0px", left: "0px" },
            range: null,
            alts: [],
            progress: false,
        };
    }

    showAlts = (event) => {
        if (event.target.alts.length) {
            const altsRect = event.target.getBoundingClientRect();
            this.setState({
                altsOpen: true,
                altsRect: {
                    top: `${altsRect.top + window.scrollY + 10}px`,
                    left: `${altsRect.left + window.scrollX}px`,
                },
                alts: event.target.alts,
            });
        }
        event.preventDefault();
    };

    updateView = (json, range) => {
        let start = range.startContainer.parentElement;
        let end = range.endContainer.parentElement.nextElementSibling;

        // If div:article-paragraph is selected by accident, it defaults to next span element.
        if (start.tagName.toLowerCase() !== "span") {
            start = range.startContainer.nextElementSibling;
        }

        json.forEach((data) => {
            const orig = data.original;
            const pps = data.paraphrases[0];
            const segs = pps.segs;

            for (let i = 0; i < segs.length; i++) {
                const seg = segs[i];

                if (start) {
                    // Check for punctuation
                    if (i < segs.length - 1) {
                        const nextSeg = segs[i + 1].text;
                        const hasPunct = removePunct(nextSeg) === "";
                        var punct = hasPunct ? nextSeg : "";
                        if (hasPunct) i++;
                    }

                    // Set attributes and properties according to each seg
                    if (orig.toLowerCase().includes(seg.text.toLowerCase())) {
                        if (seg.alts.length) {
                            start.setAttribute("class", "article-unchanged");
                        }
                    } else {
                        start.setAttribute("class", "article-word");
                    }
                    start.innerHTML = `${seg.text}${punct}`;
                    start.alts = seg.alts.map((a) => a.text);
                    start.onclick = this.showAlts;

                    start = start.nextElementSibling;
                } else {
                    console.log(
                        "Not enough span elements left in the div container."
                    );
                }
            }
        });

        // Empty unused ranges
        while (start !== end && start) {
            start.innerHTML = "";
            start = start.nextElementSibling;
        }
        // Clear selection
        window.getSelection().empty();
    };

    handleSnackClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        this.setState({ snackOpen: false });
    };

    handleTooltipClose = () => {
        this.setState({ fabOpen: false, altsOpen: false });
    };

    handleSelect = (event) => {
        if (event.target.tagName.toLowerCase() === "svg") {
            // Prevent button click from updating boundingClientRect
        } else if (!this.state.fabOpen && window.getSelection) {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text && text !== "") {
                this.setState({
                    fabOpen: true,
                });
                const fabRect = event.target.getBoundingClientRect();
                this.setState({
                    fabRect: {
                        top: `${fabRect.top + window.scrollY}px`,
                        left: `${fabRect.right + window.scrollX}px`,
                    },
                    range: selection.getRangeAt(0),
                });
            }
        }
        event.preventDefault();
    };

    handleClick = (event) => {
        this.setState({ progress: true });
        this.forceUpdate()

        const range = this.state.range;
        const payload = getFullString(range);

        fetchQuill(payload)
            .then((json) => {
                if (json) {
                    this.updateView(json, range);
                } else {
                    this.setState({ snackOpen: true });
                }
            })
            .then(() => this.setState({ progress: false }));
        event.preventDefault();
    };

    componentDidMount() {
        window.addEventListener("mouseup", this.handleSelect);
        window.addEventListener("mousedown", this.handleTooltipClose);

        [...document.getElementsByTagName("p")].forEach((p) => {
            p.outerHTML = `<div class="article-paragraph">${p.innerHTML
                .split(" ")
                .map((word) => `<span>${word}</span>`)
                .join(" ")}</div>`;
        });
    }

    render() {
        let Render = Truman;
        if (this.props.render === "Seneca") {
            Render = Seneca;
        }
        return (
            <React.Fragment>
                <Snackbar
                    open={this.state.snackOpen}
                    autoHideDuration={6000}
                    onClose={this.handleSnackClose}
                >
                    <Alert onClose={this.handleSnackClose} severity="error">
                        Unfortunately, request to the QuillBot API failed.
                    </Alert>
                </Snackbar>

                <FabTooltip
                    open={this.state.progress ? this.state.progress : this.state.fabOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    interactive
                    style={{ ...this.state.fabRect, position: "absolute" }}
                    title={
                        this.state.progress ? (
                            <CircularProgress />
                        ) : (
                            <Fab color="primary" size="small">
                                <CreateRoundedIcon onClick={this.handleClick} />
                            </Fab>
                        )
                    }
                >
                    <span />
                </FabTooltip>

                <HtmlTooltip
                    open={this.state.altsOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement="bottom-start"
                    style={{ ...this.state.altsRect, position: "absolute" }}
                    title={
                        <React.Fragment>
                            {this.state.alts.slice(0, 7).map((alt) => (
                                <span key={alt} style={{ display: "block" }}>
                                    {alt}
                                </span>
                            ))}
                        </React.Fragment>
                    }
                >
                    <span />
                </HtmlTooltip>

                <Render />
            </React.Fragment>
        );
    }
}
export default Article;
