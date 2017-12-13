import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'

export default ({ deal }) => {

  if (deal.deal_type !== 'Selling') {
    return false
  }

  return (
    <div className="create-offer">
      <Button
        className="add-offer-button"
        onClick={() => browserHistory.push(`/dashboard/deals/${deal.id}/create-offer`)}
      >
        Add New Offer
      </Button>
    </div>
  )
}
