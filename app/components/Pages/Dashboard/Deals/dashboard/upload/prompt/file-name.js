import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { setUploadAttributes } from '../../../../../../../store_actions/deals'

class FileName extends React.Component {
  constructor(props) {
    super(props)

    this.inputs = []
  }

  toggleEditName(fileId, file) {
    this.props.setUploadAttributes(fileId, {
      editNameEnabled: file.properties.editNameEnabled ? false : true,
      fileTitle: this.inputs[fileId].value
    })
  }

  render() {
    const { file, fileId, canEditName } = this.props

    return (
      <div>
        <img
          src="/static/images/deals/document.png"
        />

        <input
          ref={ref => this.inputs[fileId] = ref}
          className={cn('input-edit-name', {
            disabled: !canEditName
          })}
          readOnly={!canEditName}
          defaultValue={file.fileObject.name}
        />

        <img
          className={cn('edit-icon', { canEditName })}
          onClick={() => this.toggleEditName(fileId, file)}
          src={`/static/images/deals/${canEditName ? 'circle-check.svg' : 'edit-pen.png'}`}
        />
      </div>
    )
  }
}

export default connect(null, { setUploadAttributes })(FileName)
