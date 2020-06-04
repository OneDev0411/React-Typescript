import React from 'react'
import { connect } from 'react-redux'

import { addNotification as notify } from 'reapop'

import _ from 'underscore'

import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import Loader from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'
import importPdfJs from 'utils/import-pdf-js'

import DraggablePage from '../components/DraggablePage'

import { PageSelector } from './PageSelector'

import {
  PagesContainer,
  FileInfo,
  Title,
  PagesCount,
  Divider,
  UsedPage
} from './styled'
import { SectionCard, PageNumber, Header } from '../styled'

class PdfList extends React.Component {
  state = {
    visiblePages: Array.apply(null, { length: 15 }).map(
      (v, i) => `${this.props.files[0].id}${i + 1}`
    )
  }

  componentDidMount() {
    this.initialize()

    this.observer = new IntersectionObserver(this.onObserve, {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: 0.8
    })
  }

  getListStyle = () => ({
    background: '#fff',
    width: '100%'
  })

  onObserve = entries => {
    if (entries.length > 25) {
      return false
    }

    this.setState({
      visiblePages: entries.map(
        data => `${data.target.dataset.pdf}${data.target.dataset.page}`
      )
    })
  }

  async initialize() {
    const PDFJS = await importPdfJs()

    this.props.files.forEach(async file => {
      try {
        const doc = await PDFJS.getDocument(file.url)

        await this.props.onDocumentLoad(file.id, doc)
      } catch (e) {
        const message =
          e.name === 'PasswordException'
            ? `Sorry "${file.name}" is password protected.`
            : `Sorry we can't open "${
                file.name
              }". it's damaged or not readable. ${e.message}`

        this.props.notify({
          title: 'Cannot open pdf file',
          message,
          status: 'warning'
        })
      }
    })
  }

  getFileById = id => this.props.files.find(file => file.id === id)

  isPageSelected = (documentId, page) =>
    !!this.props.selectedPages[`${documentId}-${page}`]

  isPageUsed = (documentId, page) =>
    !!this.props.usedPages[`${documentId}-${page}`]

  renderPageHeader = (props, documentId, page) => {
    if (!this.isPageUsed(documentId, page)) {
      return false
    }

    return <UsedPage>Used</UsedPage>
  }

  renderPageFooter = (props, documentId, page) => (
    <Flex alignCenter style={{ marginTop: '0.5rem' }}>
      <PageNumber>{props.pageNumber}</PageNumber>
      {this.isPageSelected(documentId, page) === false && (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => this.props.onChangeSelectedPages(documentId, page)}
        >
          Add Page
        </Button>
      )}
    </Flex>
  )

  render() {
    return (
      <SectionCard style={this.props.style}>
        {_.map(this.props.documents, (doc, id) => (
          <React.Fragment key={id}>
            <Header>
              <FileInfo>
                <Title>
                  <TextMiddleTruncate text={this.getFileById(id).name} />
                </Title>
                <PagesCount> - {doc.numPages} Pages</PagesCount>
              </FileInfo>

              <Divider />

              <PageSelector
                pagesCount={doc.numPages}
                documentId={id}
                onChange={this.props.onSelectMultiplePages}
              />

              <Divider />
            </Header>

            <PagesContainer>
              {Array.apply(null, { length: doc.numPages }).map((v, i) => (
                <DraggablePage
                  key={i}
                  index={id}
                  pdfId={id}
                  observer={this.observer}
                  document={doc}
                  pageNumber={i + 1}
                  quailtyScale={0.5}
                  zoomScale={1.5}
                  isDraggable={this.isPageSelected(id, i + 1) === false}
                  isVisible={this.state.visiblePages.includes(`${id}${i + 1}`)}
                  totalPages={doc.numPages}
                  onEndDrag={this.props.onChangeSelectedPages}
                  headerRenderer={props =>
                    this.renderPageHeader(props, id, i + 1)
                  }
                  footerRenderer={props =>
                    this.renderPageFooter(props, id, i + 1)
                  }
                  canvasStyle={{
                    opacity:
                      this.isPageSelected(id, i + 1) ||
                      this.isPageUsed(id, i + 1)
                        ? 0.5
                        : 1
                  }}
                  pageStyle={{
                    display: 'inline-block',
                    width: '30%',
                    margin: '0.5rem 0.5rem 1rem 0.5rem'
                  }}
                />
              ))}
            </PagesContainer>
          </React.Fragment>
        ))}

        {_.size(this.props.documents) === 0 && (
          <Flex justifyBetween style={{ width: '100%', marginTop: '2rem' }}>
            <Loader style={{ width: '10rem' }} />
          </Flex>
        )}
      </SectionCard>
    )
  }
}

export default connect(
  null,
  { notify }
)(PdfList)
