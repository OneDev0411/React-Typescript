import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import Flex from 'styled-flex-component'

import styled from 'styled-components'

import { Button } from '@material-ui/core'

import { setUploadAttributes } from 'actions/deals'

import { grey } from 'views/utils/colors'

const Container = styled(Flex)`
  height: 100%;
  padding-left: 0.5rem;
  background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : '#f9f9f9')};
  border: solid 1px
    ${({ isFocused, theme }) =>
      isFocused ? theme.palette.secondary.main : '#d4d4d4'};
  :hover {
    background-color: ${({ isFocused, theme }) =>
      isFocused ? '#ffffff' : theme.palette.grey.A100};
  }
`

const Input = styled.input`
  width: 79%;
  height: 30px;
  padding: 0 5px;
  font-size: 14px;
  caret-color: ${({ theme }) => theme.palette.secondary.main};
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
        />

        {isFocused ? (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => this.save(file)}
          >
            Save
          </Button>
        ) : (
          <Button
            size="small"
            color="secondary"
            className={cn({
              canEditName: isFocused
            })}
            onClick={() => this.setActiveState()}
          >
            EDIT
          </Button>
        )}
      </Container>
    )
  }
}

export default connect(
  null,
  { setUploadAttributes }
)(FileName)
