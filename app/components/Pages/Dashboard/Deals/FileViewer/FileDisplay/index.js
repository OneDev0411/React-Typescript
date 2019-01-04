import React from 'react'

import { PdfViewer } from 'components/PdfViewer'

import { Image } from './Image'
import { Html } from './Html'
import { Unknown } from './Unknown'

import { PageContent } from '../styled'

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
