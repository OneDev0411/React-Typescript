import React from 'react'
import styled from 'styled-components'
import { func } from 'prop-types'

import { blue, grey } from 'views/utils/colors'
import Checkmark from 'components/SvgIcons/Checkmark/IconCheckmark'

const CheckBox = styled.span`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 3px;
  background-color: ${props => (props.isSelected ? blue.A100 : '#fff')};
  border: solid 1px ${props => (props.isSelected ? blue.A100 : grey.A300)};

  :hover {
    background-color: ${props => (props.isSelected ? blue.A200 : grey.A200)};
    border-color: ${props => (props.isSelected ? blue.A200 : '#000')};
    opacity: ${props => (props.isSelected ? 0.8 : 1)};
  }
`

export class CheckBoxButton extends React.Component {
  static propTypes = {
    onClick: func.isRequired
  }

  state = {
    isSelected: this.props.isSelected
  }

  componentWillReceiveProps({ isSelected }) {
    if (this.state.isSelected === isSelected) {
      return false
    }

    this.setState({
      isSelected
    })
  }

  handleClick = e => {
    e.stopPropagation()

    this.setState(state => ({
      isSelected: !state.isSelected
    }))

    this.props.onClick(e)
  }

  render() {
    return (
      <CheckBox
        {...this.props}
        onClick={this.handleClick}
        isSelected={this.state.isSelected}
      >
        {this.state.isSelected && <Checkmark />}
      </CheckBox>
    )
  }
}
