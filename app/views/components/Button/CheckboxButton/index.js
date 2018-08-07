import React from 'react'
import styled from 'styled-components'
import { func } from 'prop-types'

import Checkmark from '../../SvgIcons/Checkmark/IconCheckmark'

const CheckBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 19px;
  border-radius: 3px;
  background-color: ${props => (props.isSelected ? '#2196f3' : '#fff')};
  border: solid 1px ${props => (props.isSelected ? '#2196f3' : '#cad4db')};
  text-align: center;
  cursor: pointer;

  :hover {
    background-color: ${props => (props.isSelected ? '#2196f3' : '#e8edf0')};
    border-color: ${props => (props.isSelected ? '#2196f3' : '#8da3b2')};
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
