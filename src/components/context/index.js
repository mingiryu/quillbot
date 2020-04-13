import React, { Component } from "react";
const { Provider, Consumer } = React.createContext();

// Note: You could also use hooks to provide state and convert this into a functional component.
class ContextProvider extends Component {
    state = {
        error: "",
        tooltip: null,
    }

    triggerSnack = (value) => {
        this.setState({ error: value })
    }

    setTooltip = (value) => {
        this.setState({ tooltip: value })
    }

    render() {
        return <Provider value={{
            ...this.state,
            triggerSnack: this.triggerSnack,
            setTooltip: this.setTooltip
        }}>{this.props.children}</Provider>;
    }
}

export { ContextProvider, Consumer as ContextConsumer };