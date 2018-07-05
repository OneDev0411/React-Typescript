import React from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'
import TagIcon from '../../../../../../../views/components/SvgIcons/Tag/TagIcon'

export const CustomTagContainer = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px;
  border-color: ${({ inputFocused }) => (inputFocused ? '#2196f3' : '#d4dfe6')};
`

const IconContainer = Flex.extend`
  cursor: pointer;
  margin-left: 1em;
  svg {
    height: 16px;
    width: 16px;
  }
  :hover {
    svg > path.svg-icon--close {
      fill: #262626;
    }
  }
`
const Input = styled.input`
  width: 100%;
  margin-left: 12px;
  font-size: 2rem;
  border-width: 0;
  color: #263445;
  caret-color: #2196f3;
  :focus {
    outline: none;
  }
`

const AddButton = styled.button`
  padding: 0;
  border-width: 0;
  background: transparent;
  font-size: 16px;
  line-height: normal;
  margin-right: 16px;
  color: ${({ inputFocused }) => (inputFocused ? '#2196f3' : '#8da2b5')};
  font-weight: ${({ inputFocused }) => (inputFocused ? 'bold' : 'normal')};

  &:focus {
    outline-width: 2px;
  }
`
export default class CustomTag extends React.Component {
  state = { inputFocused: false, inputValue: '' }
  onFocus = () => {
    this.setState({ inputFocused: true })
  }

  onBlur = () => {
    this.setState({ inputFocused: false })
  }
  onChange = event => {
    const inputValue = event.target.value

    this.setState({ inputValue })
  }

  onUpsert = event => {
    const { inputValue } = this.state

    event.preventDefault()

    if (inputValue) {
      this.props.onUpsert(inputValue)
      this.setState({ inputValue: '' })
    }
  }

  render() {
    const { inputFocused, inputValue } = this.state

    return (
      <CustomTagContainer inputFocused={inputFocused} onSubmit={this.onUpsert}>
        <IconContainer center>
          <TagIcon color="#263445" />
        </IconContainer>
        <Input
          value={inputValue}
          type="text"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          placeholder="Type in custom tag here…"
        />
        <AddButton inputFocused={inputFocused} type="submit">
          Add
        </AddButton>
      </CustomTagContainer>
    )
  }
}
