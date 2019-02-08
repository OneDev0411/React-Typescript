import React from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

export class EditMode extends React.Component {
  handleDelete = () => {
    console.log('delete from father')
  }

  handleSubmit = async values => {
    console.log('submit from father', values)

    return null
  }

  preSaveFormat = (values, originalValues) => {
    console.log('preSaveFormat from father ', values, originalValues)

    return values
  }

  render() {
    return (
      <InlineAddressField
        handleSubmit={this.handleSubmit}
        preSaveFormat={this.preSaveFormat}
        handleCancel={this.props.toggleMode}
        renderSearchField={props => <input {...props} type="text" />}
      />
    )
  }
}
