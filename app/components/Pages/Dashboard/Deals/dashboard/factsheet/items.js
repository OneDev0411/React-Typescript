import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import Deal from '../../../../../../models/Deal'
import Editable from './inline-edit'
import { updateContext } from '../../../../../../store_actions/deals'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false
    }
  }

  approveField(e, field, ctx) {
    e.stopPropagation()
    this.updateField(field, ctx.rawValue || ctx.value)
  }

  onChangeContext(field, value) {
    this.updateField(field, value)
  }

  async updateField(field, value) {
    const { deal, updateContext, isBackOffice } = this.props

    // set state
    this.setState({ saving: field.name })

    await updateContext(deal.id, {
      [field.name]: {
        value,
        approved: field.needs_approval
      }
    })

    // set state
    this.setState({ saving: null })
  }

  render() {
    const { saving } = this.state
    const {
      table, deal, isBackOffice, showTitle, title, getValue
    } = this.props

    return (
      <div>
        {showTitle !== false && <div className="deal-info-title">{title}</div>}

        <div className="fact-table critical-dates">
          {_.chain(table)
            .map(field => {
              const context = Deal.get.context(deal, field.name)
              const fieldCtx = getValue(deal, field)
              const disabled = field.disabled === true
              const approved =
                (context && context.approved_at !== null) || field.approved

              return (
                <div key={`CRITICAL_DATE_${field.name}`}>
                  <div className={cn('fact-row', { disabled })}>
                    <div className="name">{field.label}</div>

                    <Editable
                      field={field}
                      saving={saving}
                      context={fieldCtx}
                      disabled={disabled}
                      approved={approved}
                      isBackOffice={isBackOffice}
                      needsApproval={!isBackOffice && field.needs_approval}
                      onChange={(field, value) => this.onChangeContext(field, value)}
                    />
                  </div>

                  <div className="approve-row">
                    {isBackOffice &&
                      fieldCtx.value &&
                      !disabled &&
                      !approved &&
                      saving !== field.name && (
                        <button
                          className="btn-approve"
                          onClick={e => this.approveField(e, field, fieldCtx)}
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
  { updateContext }
)(Table)
