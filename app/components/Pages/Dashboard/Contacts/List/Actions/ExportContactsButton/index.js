import React, { Fragment } from 'react'
import fileSaver from 'file-saver'
import superagent from 'superagent'
import { connect } from 'react-redux'

import { getActiveTeam } from 'utils/user-teams'

import OpenModalButton from './button'
import Modal from './modal'

class ExportContacts extends React.Component {
  state = {
    isModalOpen: false
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
    this.closeModal()
  }

  render() {
    return (
      <Fragment>
        <OpenModalButton
          disabled={this.props.disabled}
          onClick={this.openModal}
        />
        <Modal
          isOpen={this.state.isModalOpen}
          onClose={this.closeModal}
          downloadType={this.state.downloadType}
          onExportTypeChange={this.handleExportTypeChange}
          onExportClick={this.sendDownloadReuqest}
        />
      </Fragment>
    )
  }
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(ExportContacts)
