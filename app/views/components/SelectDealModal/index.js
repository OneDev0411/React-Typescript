import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectDeals } from '../../../reducers/deals/list'

import BareModal from '../BareModal'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import AddManuallyButton from './components/AddManuallyButton'
import CancelButton from '../Button/CancelButton'

const propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleAddManually: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  handleOnClose: PropTypes.func.isRequired,
  handleSelectedItem: PropTypes.func.isRequired,
  deals: PropTypes.arrayOf(PropTypes.shape),
  defaultSearchFilter: PropTypes.string
}

const defaultProps = {
  title: 'Select a deal',
  defaultSearchFilter: ''
}

class SelectContactModal extends React.Component {
  render() {
    const { handleAddManually } = this.props

    return (
      <BareModal
        isOpen={this.props.isOpen}
        contentLabel={this.props.title}
        onRequestClose={this.props.handleOnClose}
      >
        <Header title={this.props.title}>
          {handleAddManually && (
            <AddManuallyButton onClick={handleAddManually} />
          )}
        </Header>
        <Body
          user={this.props.user}
          deals={this.props.deals}
          handleAddManually={handleAddManually}
          handleSelectedItem={this.props.handleSelectedItem}
          defaultSearchFilter={this.props.defaultSearchFilter}
        />
        <Footer>
          <CancelButton onClick={this.props.handleOnClose}>Cancel</CancelButton>
        </Footer>
      </BareModal>
    )
  }
}

SelectContactModal.propTypes = propTypes
SelectContactModal.defaultProps = defaultProps

function mapStateToProps(state) {
  return {
    user: state.user,
    deals: selectDeals(state.deals.list)
  }
}

export default connect(mapStateToProps)(SelectContactModal)
