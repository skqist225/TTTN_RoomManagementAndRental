/* tslint:disable */

import React, { Component } from 'react';



export default class OutsideClickHandler extends Component {
    state = {
        clickCaptured: false,
    };

    innerClick = () => {
        return this.setState({ clickCaptured: true });
    };

    getProps() {
        return {
            onMouseDown: this.innerClick,
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.documentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.documentClick);
    }

    documentClick = (event) => {
        if (!this.state.clickCaptured && this.props.onClickOutside) {
            this.props.onClickOutside(event);
        }
        this.setState({ clickCaptured: false });
    };

    renderComponent() {
        return React.createElement(
            this.props.component || 'div',
            this.getProps(),
            this.props.children
        );
    }

    render() {
        if (typeof this.props.children === 'function') {
            return this.props.children(this.getProps());
        }

        return this.renderComponent();
    }
}