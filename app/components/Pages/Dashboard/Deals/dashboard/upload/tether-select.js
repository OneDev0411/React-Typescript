import React, { Component } from 'react';
import Select from 'react-select';
import TetherComponent from 'react-tether';
import Dimensions from 'react-dimensions';

class WrappedOuter extends Component {
    render() {
        const {
            outer,
            containerWidth
        } = this.props;

        return (
            <TetherComponent
                attachment="top left"
                targetAttachment="bottom left"
                constraints={[{
                    to: 'scrollParent',
                    attachment: 'together',
                }]}
                classes={{element: 'tethered-select-options'}}
            >
                {/* The first child is tether's target */}
                <div></div>
                {/* Apply position:static to our menu so that it's parent will get the correct dimensions and we can tether the parent */}
                {React.cloneElement(outer, {style: {position: 'static', minWidth: containerWidth}})}
            </TetherComponent>
        );
    }
}

WrappedOuter = Dimensions()(WrappedOuter); // <---- Here's where the outer element is wrapped with Dimensions

export default class TetheredSelect extends Select {
    constructor(props) {
        super(props);

        this.renderOuter = this._renderOuter;
    }

    componentDidMount() {
        super.componentDidMount.call(this);
    }

    _renderOuter() {
        const outer = super.renderOuter.apply(this, arguments);

        // Don't return an updated menu render if we don't have one
        if (!outer) {
            return null;
        }

        return <WrappedOuter outer={outer}/>;
    }
}
