import React, { Component } from 'react'

import IconButton from 'components/Button/IconButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

export default class Item extends Component {
  handleSave = data => console.log(data)

  handleDelete = data => console.log(data)

  handleAddNew = data => console.log(data)

  renderEditMode = props => {
    console.log('renderEditoMode')
    console.log(props)

    return <span>This is edit mode</span>
  }

  renderViewMode = () => {
    console.log('renderViewMode')
    console.log(this.props)

    return (
      <IconButton>
        {this.props.tag.text}
        <DeleteIcon />
      </IconButton>
    )
  }

  render() {
    return (
      <InlineEditableField
        handleSave={this.handleSave}
        handleDelete={this.handleDelete}
        handleAddNew={this.handleAddNew}
        isDisabled={false}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showDelete
        // toggleModeCallback={this.setMode}
      />
    )
  }
}
