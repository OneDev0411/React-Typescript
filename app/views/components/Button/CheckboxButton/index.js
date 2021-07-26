import React from 'react'

import { mdiCheck } from '@mdi/js'
import { func } from 'prop-types'
import styled from 'styled-components'

import { blue, grey } from '../../../utils/colors'
import { SvgIcon } from '../../SvgIcons/SvgIcon'

const CheckBox = styled.span`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => (props.isDisabled ? 'not-allowed' : 'pointer')};
  border-radius: 3px;
  background-color: ${props => (props.isSelected ? blue.A100 : '#fff')};
  border: solid 1px ${props => (props.isSelected ? blue.A100 : '#000')};
  flex-shrink: 0;

  svg {
    color: #ffffff;
  }

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

  UNSAFE_componentWillReceiveProps({ isSelected }) {
    if (this.state.isSelected === isSelected) {
      return false
    }

    this.setState({
      isSelected
    })
  }

  handleClick = e => {
    e.stopPropagation()

    if (this.props.isDisabled) {
      return false
    }

    this.setState(state => ({
      isSelected: !state.isSelected
    }))

    this.props.onClick(e)
  }

  render() {
    const { isSelected } = this.state

    return (
      <CheckBox
        {...this.props}
        data-test="checkbox"
        onClick={this.handleClick}
        isSelected={isSelected}
        isDisabled={this.props.isDisabled}
      >
        {isSelected && <SvgIcon path={mdiCheck} />}
      </CheckBox>
    )
  }
}
