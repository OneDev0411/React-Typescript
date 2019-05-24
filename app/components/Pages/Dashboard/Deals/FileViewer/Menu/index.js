import React from 'react'

import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import PdfSplitter from '../../PdfSplitter'

import { MenuContainer, MenuTitle, MenuDivider } from '../styled'

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
        <MenuContainer>
          <MenuTitle>
            <TextMiddleTruncate
              text={props.title}
              maxLength={50}
              tooltipPlacement="bottom"
            />
          </MenuTitle>

          <Flex alignCenter>
            <div>
              <ActionButton
                appearance="outline"
                onClick={props.onToggleFactsheet}
              >
                {props.isFactsheetOpen ? 'Hide' : 'Show'} Factsheet
              </ActionButton>

              {props.task && (
                <ActionButton
                  appearance="outline"
                  style={{ marginLeft: '1rem' }}
                  onClick={props.onToggleComments}
                >
                  {props.isCommentsOpen ? 'Hide' : 'Show'} Comments
                </ActionButton>
              )}

              {props.file.type === 'pdf' && !props.isEnvelopeView && (
                <ActionButton
                  style={{ marginLeft: '1rem' }}
                  onClick={this.toggleOpenPdfSplitter}
                >
                  Split PDF
                </ActionButton>
              )}
            </div>

            <MenuDivider />

            <IconButton
              iconSize="XLarge"
              inverse
              isFit
              onClick={props.onClickBackButton}
            >
              <CloseIcon />
            </IconButton>
          </Flex>
        </MenuContainer>

        {this.state.isPdfSplitterOpen && (
          <PdfSplitter
            files={[props.file]}
            deal={props.deal}
            onClose={this.toggleOpenPdfSplitter}
          />
        )}
      </React.Fragment>
    )
  }
}
