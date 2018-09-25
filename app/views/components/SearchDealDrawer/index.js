import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectDeals } from '../../../reducers/deals/list'

import Drawer from '../OverlayDrawer'
import Body from '../SelectDealModal/components/Body'

const propTypes = {
  ...Drawer.propTypes,
  defaultSearchFilter: PropTypes.string,
  onSelect: PropTypes.func.isRequired
}

const defaultProps = {
  ...Drawer.defaultProps,
  defaultSearchFilter: ''
}

function SearchDealDrawer(props) {
  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose} showFooter={false}>
      <Drawer.Header title={props.title} />
      <Drawer.Body>
        <Body
          isDrawer
          deals={props.deals}
          handleSelectedItem={props.onSelect}
          defaultSearchFilter={props.defaultSearchFilter}
        />
      </Drawer.Body>
    </Drawer>
  )
}

SearchDealDrawer.propTypes = propTypes
SearchDealDrawer.defaultProps = defaultProps

function mapStateToProps(state) {
  return {
    user: state.user,
    deals: selectDeals(state.deals.list)
  }
}

export default connect(mapStateToProps)(SearchDealDrawer)
