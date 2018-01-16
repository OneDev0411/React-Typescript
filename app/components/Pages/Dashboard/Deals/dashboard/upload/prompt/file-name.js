import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { setUploadAttributes } from '../../../../../../../store_actions/deals'

class FileName extends React.Component {
  constructor(props) {
    super(props)

    this.inputs = []
    this.state = {
      isActive: false
    }

    this._setActiveState = this._setActiveState.bind(this)
    this._save = this._save.bind(this)
  }

  _setActiveState() {
    this.setState({
      isActive: true
    })
  }

  _save(file) {
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

    return this._save(file, false)
  }

  render() {
    const { file } = this.props
    const { isActive } = this.state

    return (
      <div>
        <img src="/static/images/deals/document.png" />

        <input
          readOnly={!isActive}
          defaultValue={file.properties.fileTitle || file.fileObject.name}
          ref={ref => (this.inputs[file.id] = ref)}
          onBlur={() => this._save(file)}
          onKeyPress={e => this.onKeyPress(e, file)}
          onClick={() => this._setActiveState()}
          className={cn('input-edit-name', { disabled: !isActive })}
        />

        {isActive ? (
          <button
            className="c-button--shadow save"
            onClick={() => this._save(file)}
          >
            Save
          </button>
        ) : (
          <button
            className={cn('c-button--shadow edit-icon', {
              canEditName: isActive
            })}
            onClick={() => this._setActiveState()}
          >
            EDIT
          </button>
        )}
      </div>
    )
  }
}

export default connect(null, { setUploadAttributes })(FileName)
