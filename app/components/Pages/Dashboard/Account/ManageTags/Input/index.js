import React from 'react'

import { mdiTagOutline } from '@mdi/js'

import IconTextInput from 'components/Input/IconTextInput'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { TextInputPrefix, TextInputSuffix } from './styled'

export class Input extends React.Component {
  renderPrefixElement = () => (
    <TextInputPrefix>
      <SvgIcon path={mdiTagOutline} />
    </TextInputPrefix>
  )

  renderSuffixElement = () => (
    <TextInputSuffix
      disabled={this.props.isDisabled}
      onClick={this.props.onSubmit}
    >
      Add
    </TextInputSuffix>
  )

  render() {
    const { props } = this

    return (
      <IconTextInput
        onChange={props.onChange}
        onEnterKeyPress={props.onSubmit}
        placeholder="Add a tag..."
        prefixElementRenderer={this.renderPrefixElement}
        suffixElementRenderer={this.renderSuffixElement}
        value={props.value}
      />
    )
  }
}
