import React from 'react'

import { Button, IconButton } from '@material-ui/core'
import Flex from 'styled-flex-component'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { closeIcon } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import { getDealAddress } from 'deals/utils/get-deal-address'
import { getDealTitle } from 'deals/utils/get-deal-title'

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

            <MenuSubTitle>
              {[getDealTitle(props.deal), getDealAddress(props.deal)].join(
                ', '
              )}
            </MenuSubTitle>
          </div>

          <Flex alignCenter>
            <div>
              <Button
                color="secondary"
                variant="outlined"
                size="small"
                onClick={props.onToggleFactsheet}
              >
                {props.isFactsheetOpen ? 'Hide' : 'Show'} Factsheet
              </Button>

              {props.task && (
                <Button
                  color="secondary"
                  variant="outlined"
                  size="small"
                  style={{ marginLeft: '1rem' }}
                  onClick={props.onToggleComments}
                >
                  {props.isCommentsOpen ? 'Hide' : 'Show'} Comments
                </Button>
              )}

              {props.file.type === 'pdf' && !props.isEnvelopeView && (
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  style={{ marginLeft: '1rem' }}
                  onClick={this.toggleOpenPdfSplitter}
                >
                  Split PDF
                </Button>
              )}
            </div>

            <MenuDivider />

            <IconButton size="small" onClick={props.onClickBackButton}>
              <SvgIcon path={closeIcon} size={muiIconSizes.large} />
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
