import React from 'react'

import { PdfViewer } from 'components/PdfViewer'

import { PageContent } from '../styled'

import { Html } from './Html'
import { Image } from './Image'
import { Unknown } from './Unknown'

export class FileDisplay extends React.Component {
  get RenderFile() {
    switch (this.props.file.type) {
      case 'image':
        return <Image {...this.props} />

      case 'html':
        return <Html {...this.props} />

      case 'pdf':
        return <PdfViewer url={this.props.file.url} />

      default:
        return <Unknown {...this.props} />
    }
  }

  render() {
    return <PageContent>{this.RenderFile}</PageContent>
  }
}
