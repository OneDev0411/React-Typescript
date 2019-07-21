import React, { Fragment } from 'react'

import AttachDealIcon from 'components/SvgIcons/AttachDeal/IconAttachDeal'
import SearchDealDrawer from 'components/SearchDealDrawer'
import SelectDealFileDrawer from 'components/SelectDealFileDrawer'

import { FooterAction } from '../FooterAction'
import { DealRow } from './DealRow'

export class AddDealFile extends React.Component {
  state = {
    isDealsListOpen: false,
    isDealFilesOpen: false,
    deal: this.props.deal
  }

  handleClick = () =>
    this.setState(state => ({
      isDealsListOpen: !state.deal,
      isDealFilesOpen: !!state.deal
    }))

  openDealDrawer = () =>
    this.setState({
      isDealsListOpen: true
    })

  closeDealDrawer = () =>
    this.setState({
      isDealsListOpen: false
    })

  closeDealFilesDrawer = () =>
    this.setState({
      deal: this.props.deal || null,
      isDealFilesOpen: false,
      isDealsListOpen: !this.props.deal
    })

  handleSelectDeal = deal => {
    this.setState({
      deal,
      isDealsListOpen: false,
      isDealFilesOpen: true
    })
  }

  handleChangeSelectedDealFile = files => {
    this.setState({
      deal: this.props.deal || null,
      isDealFilesOpen: false
    })

    const documents = files.map(file => ({
      ...file,
      attachmentType: 'deal-file'
    }))

    this.props.input.onChange(documents)
  }

  get InitialAttachments() {
    return this.props.initialAttachments.filter(
      item => item.attachmentType === 'deal-file'
    )
  }

  render() {
    return (
      <Fragment>
        <FooterAction tooltipCaption="Deal Files" onClick={this.handleClick}>
          <AttachDealIcon
            style={{
              width: '1.5rem',
              height: '1.5rem'
            }}
            fillColor="#000"
          />
        </FooterAction>

        {this.state.isDealsListOpen && (
          <SearchDealDrawer
            isOpen
            showBackdrop={false}
            title="Select a deal to view its files"
            itemRenderer={DealRow}
            onClose={this.closeDealDrawer}
            onSelect={this.handleSelectDeal}
          />
        )}

        {this.state.isDealFilesOpen && (
          <SelectDealFileDrawer
            isOpen
            title={`Select files from “${this.state.deal.title}”`}
            drawerOptions={{
              showBackdrop: false
            }}
            showStashFiles={false}
            initialAttachments={this.InitialAttachments}
            defaultSelectedItems={this.props.input.value}
            deal={this.state.deal}
            onChangeSelectedDocuments={this.handleChangeSelectedDealFile}
            onClose={this.closeDealFilesDrawer}
          />
        )}
      </Fragment>
    )
  }
}
