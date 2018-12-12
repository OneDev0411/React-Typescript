import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import superagent from 'superagent'
import fileSaver from 'file-saver'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import { getActiveTeam } from '../../../../../../utils/user-teams'
import XlsxIcon from '../../../../../../views/components/SvgIcons/Xlsx/XlsxIcon'
import BareModal from '../../../../../../views/components/BareModal'
import RadioButton from '../../../../../../views/components/RadioButton'
import { Item } from '../../../../../../views/CRM/touches/TouchesList/Item/index'

const Button = ActionButton.withComponent('a')
const Xlsx = styled(XlsxIcon)`
  margin-right: 0.5rem;
`

const SAME_ROW_DOWNLOAD_TYPE = 'same'
const SEPARATE_ROW_DOWNLOAD_TYPE = 'separate'

class ExportContacts extends React.Component {
  state = {
    isModalOpen: false,
    downloadType: SAME_ROW_DOWNLOAD_TYPE
  }

  sendDownloadReuqest = async () => {
    const { exportIds, filters, user, users } = this.props
    const activeTeam = getActiveTeam(user)
    const activeBrand = activeTeam.brand.id
    const url = `/api/contacts/export/outlook/${activeBrand}/`

    const params = {
      type: this.state.downloadType
    }

    if (Array.isArray(exportIds) && exportIds.length > 0) {
      params.ids = exportIds
    } else {
      const filtersExits = filters && typeof filters === 'object'

      if (filtersExits) {
        params.filters = filters.map(filter =>
          encodeURIComponent(JSON.stringify(filter))
        )
      }

      if (users && typeof users === 'object') {
        params.users = users.map(user => encodeURIComponent(user))
      }
    }

    const response = await superagent.post(url).send(params)
    const blob = new Blob([response.text], { type: 'text/csv' })

    fileSaver.saveAs(blob, response.headers['x-rechat-filename'])
  }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  handleExportTypeChange = exportType => {
    this.setState({ downloadType: exportType })
  }

  renderOptions() {
    return (
      <Fragment>
        <RadioButton
          selected={this.state.downloadType === SAME_ROW_DOWNLOAD_TYPE}
          title="Same row"
          caption="Good for sending out mailers"
          onClick={() => this.handleExportTypeChange(SAME_ROW_DOWNLOAD_TYPE)}
        />
        <RadioButton
          selected={this.state.downloadType === SEPARATE_ROW_DOWNLOAD_TYPE}
          title="Separate rows"
          caption="Good for sending out email"
          onClick={() =>
            this.handleExportTypeChange(SEPARATE_ROW_DOWNLOAD_TYPE)
          }
        />
      </Fragment>
    )
  }

  renderSameRowExample() {
    const listItems = ['Primary Contact', 'Partner Contact']

    return (
      <ul style={{ padding: 0, margin: 0, width: '100%' }}>
        {listItems.map(item => (
          <li
            key={Item}
            style={{
              backgroundColor: '#e0e0e0',
              display: 'inline-block',
              width: '48%',
              margin: '1%',
              height: '38px',
              padding: '7px 8px'
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    )
  }

  renderSeparateRowExample() {
    const listItems = ['Primary Contact', 'Partner Contact']

    return (
      <ul style={{ padding: 0, margin: 0, width: '100%' }}>
        {listItems.map(item => (
          <li
            key={Item}
            style={{
              backgroundColor: '#e0e0e0',
              display: 'block',
              height: '38px',
              padding: '7px 8px',
              margin: '1% 0'
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    )
  }

  renderModalButtons() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '48%',
          margin: '53px auto'
        }}
      >
        <ActionButton
          style={{
            width: '100px',
            padding: '0 26px'
          }}
          appearance="outline"
          onClick={this.closeModal}
        >
          Cancel
        </ActionButton>
        <ActionButton
          style={{
            width: '140px',
            padding: '0 46px'
          }}
          onClick={this.sendDownloadReuqest}
        >
          Export
        </ActionButton>
      </div>
    )
  }

  renderModal() {
    return (
      <BareModal
        isOpen={this.state.isModalOpen}
        onRequestClose={this.closeModal}
      >
        <div
          style={{
            padding: '6px 20px',
            textAlign: 'center',
            userSelect: 'none'
          }}
        >
          <h2 style={{ fontWeight: 600 }}>
            How do you want partner names to display in spreadsheet?
          </h2>
          <div
            style={{
              marginTop: '20px',
              fontSize: '14px',
              height: '120px'
            }}
          >
            <div
              style={{
                backgroundColor: '#f5f5f5',
                width: '50%',
                float: 'left',
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                alignItems: 'center'
              }}
            >
              {this.state.downloadType === SAME_ROW_DOWNLOAD_TYPE &&
                this.renderSameRowExample()}
              {this.state.downloadType === SEPARATE_ROW_DOWNLOAD_TYPE &&
                this.renderSeparateRowExample()}
            </div>
            <div
              style={{
                float: 'right',
                width: '45%',
                textAlign: 'left',
                marginTop: '15px'
              }}
            >
              {this.renderOptions()}
            </div>
          </div>
          {this.renderModalButtons()}
        </div>
      </BareModal>
    )
  }

  renderButton() {
    return (
      <Button
        appearance="outline"
        disabled={this.props.disabled}
        size="small"
        onClick={this.openModal}
      >
        <Xlsx />
        Export to Spreadsheet
      </Button>
    )
  }

  render() {
    return (
      <Fragment>
        {this.renderButton()}
        {this.renderModal()}
      </Fragment>
    )
  }
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(ExportContacts)
