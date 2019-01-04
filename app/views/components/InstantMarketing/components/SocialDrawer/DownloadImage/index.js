import React from 'react'
import FileSaver from 'file-saver'
import agent from 'superagent'

import ImageFileIcon from 'components/SvgIcons/ImageFile/ImageFileIcon'

import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

import { Button as DownloadButton } from '../components/Section/styled'
import { Section } from '../components/Section'

export default class DownloadImage extends React.Component {
  state = {
    isWorking: false
  }

  get FileName() {
    if (!this.props.instance) {
      return ''
    }

    const { url } = this.props.instance.file

    return truncateTextFromMiddle(url.substring(url.lastIndexOf('/') + 1), 40)
  }

  handleDownload = async () => {
    this.setState({
      isWorking: true
    })

    const data = await agent
      .get(this.props.instance.file.url)
      .responseType('blob')

    FileSaver.saveAs(data.body, this.FileName)

    this.setState({
      isWorking: false
    })
  }

  render() {
    const { state } = this

    return (
      <Section
        title="Download Image:"
        description="Download image to your computer and share however you want."
        button={() => (
          <DownloadButton
            disabled={state.isWorking}
            onClick={this.handleDownload}
          >
            {state.isWorking ? 'Working...' : 'Download'}
          </DownloadButton>
        )}
      >
        <ImageFileIcon /> {this.FileName}
      </Section>
    )
  }
}
