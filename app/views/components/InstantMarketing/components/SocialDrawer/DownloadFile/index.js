import React from 'react'
import FileSaver from 'file-saver'
import agent from 'superagent'
import { mdiFileImageOutline } from '@mdi/js'

import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'
import { getFileType } from 'utils/file-utils/get-file-type'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Button as DownloadButton } from '../components/Section/styled'
import { Section } from '../components/Section'

export default class DownloadFile extends React.Component {
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

    const fileType = getFileType(this.props.instance.file)
    const [title, description] =
      fileType === 'pdf'
        ? [
            'Download PDF for Print:',
            'Download PDF to your computer and print or share it however you want.'
          ]
        : [
            'Download Image:',
            'Download image to your computer and share however you want.'
          ]

    return (
      <Section
        title={title}
        description={description}
        button={() => (
          <DownloadButton
            disabled={state.isWorking}
            onClick={this.handleDownload}
          >
            {state.isWorking ? 'Working...' : 'Download'}
          </DownloadButton>
        )}
      >
        <SvgIcon path={mdiFileImageOutline} /> {this.FileName}
      </Section>
    )
  }
}
