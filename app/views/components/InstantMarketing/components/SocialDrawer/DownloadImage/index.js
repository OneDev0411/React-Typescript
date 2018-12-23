import React from 'react'
import agent from 'superagent'

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

function download(instance) {
  agent
    .get(instance.file.url)
    .withCredentials()
    .responseType('blob')
    .then(res => {
      console.log(res)
    })
}

export default function DownloadImage(props) {
  return (
    <Section
      title="Download Image:"
      description="Download image to your computer and share however you want."
      button={() => (
        <DownloadButton onClick={() => download(props.instance)}>
          Download
        </DownloadButton>
      )}
    >
      <ImageFileIcon /> {getFileName(props.instance)}
    </Section>
  )
}
