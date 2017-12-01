import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { setUploadAttributes } from '../../../../../../../store_actions/deals'

class FileName extends React.Component {
  constructor(props) {
    super(props)

    this.inputs = []
  }

  toggleEdit(file, status) {
    this.props.setUploadAttributes(file.id, {
      editNameEnabled: status,
      fileTitle: this.inputs[file.id].value
    })
  }

  onKeyPress(e, file) {
    if (e.which !== 13) {
      return false
    }

    return this.toggleEdit(file, false)
  }

  render() {
    const { file, canEditName } = this.props

    return (
      <div>
        <img src="/static/images/deals/document.png" />

        <input
          ref={ref => this.inputs[file.id] = ref}
          autoFocus
          className={cn('input-edit-name', { disabled: !canEditName })}
          readOnly={!canEditName}
          defaultValue={file.fileObject.name}
          onBlur={() => this.toggleEdit(file, false)}
          onKeyPress={e => this.onKeyPress(e, file)}
          onClick={() => this.toggleEdit(file, true)}
        />

        {
          canEditName ?
          <span
            onClick={() => this.toggleEdit(file, false)}
            className="save"
          >
            Save
          </span> :
          <img
            className={cn('edit-icon', { canEditName })}
            src={`/static/images/deals/edit-pen.png`}
            onClick={() => this.toggleEdit(file, true)}
          />
        }
      </div>
    )
  }
}

export default connect(null, { setUploadAttributes })(FileName)
