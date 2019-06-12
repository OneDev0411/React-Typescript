import React from 'react'

import Flex from 'styled-flex-component'

import { getDealTitle } from 'deals/utils/get-deal-title'

import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import PdfSplitter from '../../PdfSplitter'

import { MenuContainer, MenuTitle, MenuSubTitle, MenuDivider } from '../styled'

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
          <div>
            <MenuTitle>
              <TextMiddleTruncate
                text={props.title}
                maxLength={50}
                tooltipPlacement="bottom"
              />
            </MenuTitle>

            <MenuSubTitle>{getDealTitle(props.deal)}</MenuSubTitle>
          </div>

          <Flex alignCenter>
            <div>
              <ActionButton
                appearance="outline"
                size="small"
                onClick={props.onToggleFactsheet}
              >
                {props.isFactsheetOpen ? 'Hide' : 'Show'} Factsheet
              </ActionButton>

              {props.task && (
                <ActionButton
                  appearance="outline"
                  size="small"
                  style={{ marginLeft: '1rem' }}
                  onClick={props.onToggleComments}
                >
                  {props.isCommentsOpen ? 'Hide' : 'Show'} Comments
                </ActionButton>
              )}

              {props.file.type === 'pdf' && !props.isEnvelopeView && (
                <ActionButton
                  size="small"
                  style={{ marginLeft: '1rem' }}
                  onClick={this.toggleOpenPdfSplitter}
                >
                  Split PDF
                </ActionButton>
              )}
            </div>

            <MenuDivider />

            <IconButton
              iconSize="Large"
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
