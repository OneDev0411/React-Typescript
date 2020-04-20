import React from 'react'
import _ from 'underscore'
import { DropTarget } from 'react-dnd'

import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

import { Page } from 'components/PdfViewer/Page'

import { EmptyState } from './EmptyState'
import { PageNumber } from '../styled'

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: false }),
    isOverCurrent: monitor.isOver({ shallow: false }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  }
}

class SelectedItems extends React.Component {
  getListStyle = (isDraggingOver, canDrop) => ({
    flex: 1,
    border: canDrop ? '1px dashed #0945eb' : 'none',
    background: isDraggingOver ? '#eee' : '#fff',
    filter: isDraggingOver ? 'blur(2px)' : 'none'
  })

  render() {
    const DropTarget = (
      <div style={this.getListStyle(this.props.isOver, this.props.canDrop)}>
        {_.size(this.props.selectedPages) === 0 && <EmptyState />}

        {_.map(this.props.selectedPages, (item, key) => (
          <Page
            key={key}
            pdfId={item.docId}
            observer={this.observer}
            document={this.props.documents[item.docId]}
            pageNumber={item.pageNumber}
            quailtyScale={2}
            zoomScale={1.5}
            isVisible
            footerRenderer={props => (
              <Flex alignCenter style={{ marginTop: '0.5rem' }}>
                <PageNumber>{props.pageNumber}</PageNumber>

                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() =>
                    this.props.onChangeSelectedPages(
                      item.docId,
                      item.pageNumber
                    )
                  }
                >
                  Deselect
                </Button>
              </Flex>
            )}
            pageStyle={{
              display: 'inline-block',
              width: '48%',
              margin: '0.5rem 1% 1rem 1%'
            }}
          />
        ))}
      </div>
    )

    return this.props.connectDropTarget(DropTarget)
  }
}

export default DropTarget('SPLITTER_PDF_PAGE', {}, collect)(SelectedItems)
