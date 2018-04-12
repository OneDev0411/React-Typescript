import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Deal from '../../../../../../../models/Deal'
import Editable from './editable'
import {
  updateContext,
  approveContext
} from '../../../../../../../store_actions/deals'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false
    }
  }

  async approveField(e, name, context) {
    e.stopPropagation()

    const { deal, isBackOffice, approveContext } = this.props

    if (!isBackOffice) {
      return false
    }

    // set state
    this.setState({ saving: name })

    await approveContext(deal.id, context.id)

    // set state
    this.setState({ saving: false })
  }

  onChangeContext(field, value = null) {
    this.updateField(field, value)
  }

  async updateField(field, value) {
    const { deal, updateContext, isBackOffice } = this.props

    // set state
    this.setState({ saving: field.name })

    await updateContext(deal.id, {
      [field.name]: {
        value,
        approved: isBackOffice ? true : !field.needs_approval
      }
    })

    // set state
    this.setState({ saving: null })
  }

  isSet(value) {
    return !_.isUndefined(value) && value !== null
  }

  render() {
    const { saving } = this.state
    const {
      sectionId,
      table,
      deal,
      isBackOffice,
      showTitle,
      title,
      getValue
    } = this.props

    return (
      <div>
        {showTitle !== false && <div className="deal-info-title">{title}</div>}

        <div className="fact-table critical-dates">
          {_.chain(table)
            .map(field => {
              const context = Deal.get.context(deal, field.name)
              const fieldCtx = getValue(deal, field)
              const approved =
                (context && context.approved_at !== null) || field.approved

              return (
                <div key={`CRITICAL_DATE_${field.name}`}>
                  <Editable
                    sectionId={sectionId}
                    deal={deal}
                    field={field}
                    saving={saving}
                    context={fieldCtx}
                    approved={approved}
                    isBackOffice={isBackOffice}
                    needsApproval={!isBackOffice && field.needs_approval}
                    onChange={(field, value) =>
                      this.onChangeContext(field, value || null)
                    }
                  />
                  <div className="approve-row">
                    {isBackOffice &&
                      context &&
                      !approved &&
                      saving !== field.name && (
                        <button
                          className="btn-approve"
                          onClick={e =>
                            this.approveField(e, field.name, context)
                          }
                        >
                          Approve
                        </button>
                      )}
                  </div>
                </div>
              )
            })
            .value()}
        </div>
      </div>
    )
  }
}

export default connect(
  ({ deals }) => ({
    isBackOffice: deals.backoffice
  }),
  { updateContext, approveContext }
)(Table)
