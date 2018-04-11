import React from 'react'

import Radio from './index'

class RadioWithState extends React.PureComponent {
  state = { stateSelected: false }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.selected && nextProps.selected !== this.props.selected) {
      this.setState({ stateSelected: false })
    }
  }
  render() {
    const { selected, onClick } = this.props
    const { stateSelected } = this.state

    const isSelected = !!selected || stateSelected

    console.log('here')

    return (
      <Radio
        {...this.props}
        selected={isSelected}
        onClick={e => {
          this.setState({ stateSelected: !stateSelected })
          onClick && onClick(e)
        }}
      />
    )
  }
}

export default RadioWithState
