import React from 'react'
import { mdiTagOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import IconTextInput from 'components/Input/IconTextInput'

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
        style={{ margin: '1rem 1.5rem' }}
        suffixElementRenderer={this.renderSuffixElement}
        value={props.value}
      />
    )
  }
}
