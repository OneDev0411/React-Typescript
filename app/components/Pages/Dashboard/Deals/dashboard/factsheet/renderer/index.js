import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Deal from '../../../../../../../models/Deal'
import DealContext from '../../../../../../../models/DealContext'
import Editable from './editable'
import {
  updateContext,
  approveContext
} from '../../../../../../../store_actions/deals'

import { isBackOffice } from '../../../../../../../utils/user-teams'
import ActionButton from 'components/Button/ActionButton'

class Table extends React.Component {
  state = {
    isSaving: false
  }

  async approveField(e, name, context) {
    e.stopPropagation()

    const { deal, isBackOffice, approveContext } = this.props

    if (!isBackOffice) {
      return false
    }

    // set state
    this.setState({ isSaving: name })

    await approveContext(deal.id, context.id)

    // set state
    this.setState({ isSaving: false })
  }

  onChangeContext(field, value) {
    const fieldValue = !_.isUndefined(value) && value !== null ? value : null

    this.updateField(field, fieldValue)
  }

  async updateField(field, value) {
    const { deal, updateContext, isBackOffice } = this.props

    // set state
    this.setState({ isSaving: field.name })

    await updateContext(deal.id, {
      [field.name]: {
        value,
        approved: isBackOffice ? true : !field.needs_approval
      }
    })

    // set state
    this.setState({ isSaving: null })
  }

  isSet(value) {
    return !_.isUndefined(value) && value !== null
  }

  render() {
    const { isSaving } = this.state
    const {
      sectionId,
      table,
      deal,
      isBackOffice,
      showTitle,
      title
    } = this.props

    return (
      <div>
        {showTitle !== false && <div className="deal-info-title">{title}</div>}

        <div className="fact-table critical-dates">
          {_.chain(table)
            .map(field => {
              const context = Deal.get.context(deal, field.name)

              const fieldData = DealContext.getValue(deal, field)
              const approved =
                (context && context.approved_at !== null) || field.approved

              return (
                <div key={`CRITICAL_DATE_${field.name}`}>
                  <Editable
                    sectionId={sectionId}
                    deal={deal}
                    field={field}
                    saving={isSaving}
                    contextData={fieldData}
                    approved={approved}
                    isBackOffice={isBackOffice}
                    needsApproval={!isBackOffice && field.needs_approval}
                    onChange={(field, value) =>
                      this.onChangeContext(field, value)
                    }
                  />
                  <div className="approve-row">
                    {isBackOffice &&
                      context &&
                      !approved &&
                      isSaving !== field.name && (
                        <ActionButton
                          size="small"
                          onClick={e =>
                            this.approveField(e, field.name, context)
                          }
                        >
                          Approve
                        </ActionButton>
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
  ({ user }) => ({
    isBackOffice: isBackOffice(user)
  }),
  { updateContext, approveContext }
)(Table)
