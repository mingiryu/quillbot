import React from "react";
const Context = React.createContext();
const { Provider, Consumer } = Context

// Note: You could also use hooks to provide state and convert this into a functional component.
class ContextProvider extends React.Component {
    state = {
        error: "",
        tooltip: null,
        slider: { strength: 2, autoflip: 0.5 },
    }

    triggerSnack = (value) => {
        this.setState({ error: value })
    }

    setTooltip = (value) => {
        this.setState({ tooltip: value })
    }

    setSlider = (event, value) => {
        if (Number.isInteger(value) && value >= 1) {
            this.setState({ slider: { ...this.state.slider, strength: value } });
        } else {
            this.setState({ slider: { ...this.state.slider, autoflip: value } });
        }
    }

    render() {
        return <Provider value={{
            ...this.state,
            triggerSnack: this.triggerSnack,
            setTooltip: this.setTooltip,
            setSlider: this.setSlider
        }}>{this.props.children}</Provider>;
    }
}

export { ContextProvider, Consumer as ContextConsumer };
export { Context }