import React from 'react'

import ImageFileIcon from 'components/SvgIcons/ImageFile/ImageFileIcon'

import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

import { Button as DownloadButton } from '../components/Section/styled'
import { Section } from '../components/Section'

function getFileName(instance) {
  if (!instance) {
    return ''
  }

  const { url } = instance.file

  return truncateTextFromMiddle(url.substring(url.lastIndexOf('/') + 1), 40)
}

export default function DownloadImage(props) {
  return (
    <Section
      title="Download Image:"
      description="Download image to your computer and share however you want."
      button={() => (
        <a target="_blank" href={props.instance.file.url}>
          <DownloadButton>Download</DownloadButton>
        </a>
      )}
    >
      <ImageFileIcon /> {getFileName(props.instance)}
    </Section>
  )
}
