import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import Flex from 'styled-flex-component'

import { setUploadAttributes } from '../../../../../../../store_actions/deals'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import { primary, grey } from '../../../../../../../views/utils/colors'
import styled from 'styled-components'

const Container = Flex.extend`
  height: 100%;
  padding-left: 0.5rem;
  background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : '#f9f9f9')};
  border: solid 1px ${({ isFocused }) => (isFocused ? primary : '#d4d4d4')};
  :hover {
    background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : grey.A100)};
  }
`

const Input = styled.input`
  width: 79%;
  height: 30px;
  padding: 0 5px;
  font-size: 14px;
  caret-color: ${primary};
  background-color: transparent;
  color: ${grey.A900};
  border: none;

  :focus {
    outline: none;
    color: #000000;
  }

  ${Container}:hover & {
    color: #000000;
  }
`

class FileName extends React.Component {
  constructor(props) {
    super(props)

    this.inputs = []
    this.state = {
      isFocused: false
    }
  }

  setActiveState = () => {
    this.setState({
      isFocused: true
    })
  }

  save(file) {
    this.props.setUploadAttributes(file.id, {
      fileTitle: this.inputs[file.id] && this.inputs[file.id].value
    })

    this.setState({
      isFocused: false
    })
  }

  onKeyPress(e, file) {
    if (e.which !== 13) {
      return false
    }

    return this.save(file, false)
  }

  render() {
    const { file } = this.props
    const { isFocused } = this.state

    return (
      <Container alignCenter isFocused={isFocused}>
        <img src="/static/images/deals/document.png" alt="" />

        <Input
          readOnly={!isFocused}
          defaultValue={file.properties.fileTitle || file.fileObject.name}
          ref={ref => (this.inputs[file.id] = ref)}
          onBlur={() => this.save(file)}
          onKeyPress={e => this.onKeyPress(e, file)}
          onClick={() => this.setActiveState()}
          // className={cn('input-edit-name', { disabled: !isFocused })}
        />

        {isFocused ? (
          <ActionButton
            size="small"
            // className="c-button--shadow save"
            onClick={() => this.save(file)}
          >
            Save
          </ActionButton>
        ) : (
          <ActionButton
            size="small"
            appearance="link"
            className={cn({
              canEditName: isFocused
            })}
            onClick={() => this.setActiveState()}
          >
            EDIT
          </ActionButton>
        )}
      </Container>
    )
  }
}

export default connect(
  null,
  { setUploadAttributes }
)(FileName)
