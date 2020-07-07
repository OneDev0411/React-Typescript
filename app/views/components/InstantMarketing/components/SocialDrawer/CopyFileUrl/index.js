import React from 'react'
import { connect } from 'react-redux'

import { addNotification as notify } from 'reapop'

import LinkIcon from 'views/components/SvgIcons/LinkIcon'

import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'
import copy from 'utils/copy-text-to-clipboard'

import { Section } from '../components/Section'

function getDocumentLastState(instance) {
  return instance && truncateTextFromMiddle(instance.branch, 50)
}

function handleCopyUrl(props) {
  copy(props.instance.branch)

  props.notify({
    message: 'Link Copied',
    status: 'success'
  })
}

function CopyFileUrl(props) {
  return (
    <Section
      title="Copy this URL to Share:"
      buttonCaption="Copy"
      buttonProps={{
        disabled: !props.instance
      }}
      onButtonClick={() => handleCopyUrl(props)}
    >
      <LinkIcon /> {getDocumentLastState(props.instance)}
    </Section>
  )
}

export default connect(null, { notify })(CopyFileUrl)
