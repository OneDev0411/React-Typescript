import React from 'react'

import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import PdfSplitter from '../../PdfSplitter'

import { Container, Actions, Title, Divider } from './styled'

export class Menu extends React.Component {
  state = {
    isPdfSplitterOpen: false
  }

  toggleOpenPdfSplitter = () =>
    this.setState(state => ({
      isPdfSplitterOpen: !state.isPdfSplitterOpen
    }))

  render() {
    const { props } = this

    return (
      <React.Fragment>
        <Container>
          <Title>
            <TextMiddleTruncate
              text={props.title}
              maxLength={50}
              tooltipPlacement="bottom"
            />
          </Title>

          <Flex alignCenter>
            <Actions>
              {props.showFactsheetButton && (
                <ActionButton
                  appearance="outline"
                  onClick={props.onToggleFactsheet}
                >
                  {props.isFactsheetOpen ? 'Hide' : 'Show'} Factsheet
                </ActionButton>
              )}

              {props.task && (
                <ActionButton
                  appearance="outline"
                  style={{ marginLeft: '1rem' }}
                  onClick={props.onToggleComments}
                >
                  {props.isCommentsOpen ? 'Hide' : 'Show'} Comments
                </ActionButton>
              )}

              {props.file.type === 'pdf' && (
                <ActionButton
                  style={{ marginLeft: '1rem' }}
                  onClick={this.toggleOpenPdfSplitter}
                >
                  Split PDF
                </ActionButton>
              )}
            </Actions>

            <Divider />

            <IconButton
              iconSize="XLarge"
              inverse
              isFit
              onClick={props.onClickBackButton}
            >
              <CloseIcon />
            </IconButton>
          </Flex>
        </Container>

        {this.state.isPdfSplitterOpen && (
          <PdfSplitter
            files={[this.props.file]}
            deal={props.deal}
            onClose={this.toggleOpenPdfSplitter}
          />
        )}
      </React.Fragment>
    )
  }
}
