import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import Flex from 'styled-flex-component'

import { setUploadAttributes } from '../../../../../../../store_actions/deals'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'

class FileName extends React.Component {
  constructor(props) {
    super(props)

    this.inputs = []
    this.state = {
      isActive: false
    }
  }

  setActiveState() {
    this.setState({
      isActive: true
    })
  }

  save(file) {
    this.props.setUploadAttributes(file.id, {
      fileTitle: this.inputs[file.id] && this.inputs[file.id].value
    })

    this.setState({
      isActive: false
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
    const { isActive } = this.state

    return (
      <Flex alignCenter style={{ height: '100%' }}>
        <img src="/static/images/deals/document.png" alt="" />

        <input
          readOnly={!isActive}
          defaultValue={file.properties.fileTitle || file.fileObject.name}
          ref={ref => (this.inputs[file.id] = ref)}
          onBlur={() => this.save(file)}
          onKeyPress={e => this.onKeyPress(e, file)}
          onClick={() => this.setActiveState()}
          className={cn('input-edit-name', { disabled: !isActive })}
        />

        {isActive ? (
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
              canEditName: isActive
            })}
            onClick={() => this.setActiveState()}
          >
            EDIT
          </ActionButton>
        )}
      </Flex>
    )
  }
}

export default connect(
  null,
  { setUploadAttributes }
)(FileName)
