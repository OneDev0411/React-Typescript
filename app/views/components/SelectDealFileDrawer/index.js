import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getDeal } from 'actions/deals'

import Drawer from 'components/OverlayDrawer'
import ActionButton from 'components/Button/ActionButton'
import Loading from 'components/Spinner'

import Documents from './Documents'

class SelectDealFileDrawer extends React.Component {
  state = {
    deal: this.props.deal,
    isLoadingDeal: false,
    selectedItems: this.props.defaultSelectedItems || []
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    if (this.props.deal.checklists) {
      return false
    }

    this.setState({
      isLoadingDeal: true
    })

    const deal = await this.props.getDeal(this.props.deal.id)

    this.setState({
      isLoadingDeal: false,
      deal
    })
  }

  toggleSelectRow = document => {
    if (!document.checklist) {
      return false
    }

    const isExists =
      Array.isArray(this.state.selectedItems) &&
      this.state.selectedItems.some(row => row.id === document.id)

    this.setState(state => ({
      selectedItems: isExists
        ? state.selectedItems.filter(row => row.id !== document.id)
        : [...state.selectedItems, document]
    }))
  }

  handleApply = () =>
    this.props.onChangeSelectedDocuments(this.state.selectedItems)

  getTaskById = id => this.props.tasks.find(task => task.id === id)

  render() {
    const { props } = this

    return (
      <Drawer
        open={props.isOpen}
        onClose={props.onClose}
        {...props.drawerOptions}
      >
        <Drawer.Header title={props.title} />
        <Drawer.Body>
          <Documents
            deal={this.state.deal}
            showStashFiles={this.props.showStashFiles}
            initialAttachments={this.props.initialAttachments}
            selectedItems={this.state.selectedItems}
            onToggleItem={this.toggleSelectRow}
          />

          {this.state.isLoadingDeal && <Loading />}
        </Drawer.Body>

        <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
          <ActionButton
            disabled={this.state.selectedItems.length === 0}
            type="button"
            onClick={this.handleApply}
          >
            Next
          </ActionButton>
        </Drawer.Footer>
      </Drawer>
    )
  }
}

SelectDealFileDrawer.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  showStashFiles: PropTypes.bool,
  drawerOptions: PropTypes.object
}

SelectDealFileDrawer.defaultProps = {
  isOpen: false,
  title: 'Select Documents',
  showStashFiles: true,
  drawerOptions: {}
}

export default connect(
  null,
  { getDeal }
)(SelectDealFileDrawer)
