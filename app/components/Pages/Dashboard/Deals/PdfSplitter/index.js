import React from 'react'

require('intersection-observer')
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Flex from 'styled-flex-component'
import _ from 'underscore'

import Form from './Form'
import { Header } from './Header'
import PdfList from './PdfList'
import SelectedItems from './SelectedItems'
import { Container, SectionCard } from './styled'

class PdfSplitter extends React.Component {
  state = {
    documents: {},
    selectedPages: {},
    usedPages: {}
  }

  handleChangeSelectedPages = (docId, pageNumber) => {
    const key = `${docId}-${pageNumber}`
    let newState = {}

    if (this.state.selectedPages[key]) {
      newState = _.omit(
        this.state.selectedPages,
        page => `${page.docId}-${page.pageNumber}` === key
      )
    } else {
      newState = {
        ...this.state.selectedPages,
        [key]: {
          docId,
          pageNumber
        }
      }
    }

    this.setState({
      selectedPages: newState
    })
  }

  handleSelectMultiplePages = list =>
    this.setState(state => ({
      selectedPages: {
        ...state.selectedPages,
        ...list
      }
    }))

  handleLoadDocument = async (id, document) => {
    await this.setStateSync({
      documents: {
        ...this.state.documents,
        [id]: document
      }
    })
  }

  onDragEnd = result => {
    if (
      !result.destination ||
      result.destination.droppableId !== 'droppable-splitter--selected'
    ) {
      return false
    }

    const [documentId, pageNumber] = result.draggableId.split('_')

    this.handleChangeSelectedPages(documentId, ~~pageNumber)
  }

  setStateSync = async state =>
    new Promise(resolve => this.setState(state, resolve))

  handleSaveForm = closeSplitter => {
    this.setState(state => ({
      usedPages: state.selectedPages,
      documents: closeSplitter ? {} : state.documents,
      selectedPages: {}
    }))

    if (closeSplitter) {
      this.props.onClose()
    }
  }

  render() {
    return (
      <Container>
        <Header onClose={this.props.onClose} />

        <Flex justifyBetween style={{ marginBottom: '2.5rem' }}>
          <PdfList
            style={{ width: '54%' }}
            files={this.props.files}
            usedPages={this.state.usedPages}
            documents={this.state.documents}
            onDocumentLoad={this.handleLoadDocument}
            selectedPages={this.state.selectedPages}
            onChangeSelectedPages={this.handleChangeSelectedPages}
            onSelectMultiplePages={this.handleSelectMultiplePages}
          />

          <SectionCard style={{ width: '45%' }}>
            <Form
              deal={this.props.deal}
              files={this.props.files}
              selectedPages={this.state.selectedPages}
              onSave={this.handleSaveForm}
            />
            <SelectedItems
              documents={this.state.documents}
              selectedPages={this.state.selectedPages}
              onChangeSelectedPages={this.handleChangeSelectedPages}
            />
          </SectionCard>
        </Flex>
      </Container>
    )
  }
}

export default DragDropContext(HTML5Backend)(PdfSplitter)
