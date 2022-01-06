import React from 'react'

import { mdiLink } from '@mdi/js'
import { connect } from 'react-redux'

import { addNotification as notify } from 'components/notification'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import copy from 'utils/copy-text-to-clipboard'
import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

import { Section } from '../components/Section'

function getDocumentLastState(instance) {
  return (
    instance && truncateTextFromMiddle(instance.branch ?? instance.file.url, 20)
  )
}

function handleCopyUrl(props) {
  copy(props.instance.branch ?? props.instance.file.url)

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
      <SvgIcon path={mdiLink} /> {getDocumentLastState(props.instance)}
    </Section>
  )
}

export default connect(null, { notify })(CopyFileUrl)
