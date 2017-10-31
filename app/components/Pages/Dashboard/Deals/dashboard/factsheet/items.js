import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import cn from 'classnames'
import _ from 'underscore'
import moment from 'moment'
import Deal from '../../../../../../models/Deal'
import Editable from './inline-edit'
import {
  updateContext,
  createGenericTask,
  changeNeedsAttention
} from '../../../../../../store_actions/deals'

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
    const { deal, isBackOffice, updateContext } = this.props
    const editable = field.canEdit(isBackOffice)

    // set state
    this.setState({ saving: field.key })

    await updateContext(deal.id, { [field.key]: value }, editable)

    if (editable === false) {
      await this.notifyAdmin(field, value)
    }

    // set state
    this.setState({ saving: null })
  }

  async notifyAdmin(field, value) {
    const { deal, checklists, notify, changeNeedsAttention, createGenericTask } = this.props
    let displayingValue = value

    if (field.fieldType === 'date' && value && value.length > 0) {
      displayingValue = moment(value).format('MMM DD, YYYY')
    }

    const title = value && value.length > 0 ?
      `Change context ${field.name} to ${displayingValue}` :
      `Remove context ${field.name}`

    const checklist = checklists[deal.checklists[0]]
    const task = await createGenericTask(deal.id, title, checklist.id)
    changeNeedsAttention(task.id, true)

    return notify({
      message: 'Back office has been notified to change context value',
      status: 'success',
      dismissible: true,
      dismissAfter: 4000
    })
  }

  render() {
    const { saving } = this.state

    const {
      table,
      deal,
      isBackOffice,
      showTitle,
      title,
      getValue,
      getLabel
    } = this.props

    return (
      <div>
        {
          showTitle !== false &&
          <div className="deal-info-title">
            { title }
          </div>
        }

        <div className="fact-table critical-dates">
          {
            _.chain(table)
            .map(field => {
              const context = Deal.get.context(deal, field.key)
              const fieldCtx = getValue(deal, field)
              const editable = field.canEdit(isBackOffice)
              const disabled = field.disabled === true
              const approved = context && context.approved_at !== null

              return (
                <div key={`CRITICAL_DATE_${field.key}`}>
                  <div className="fact-row">
                    <div className="name">
                      { getLabel ? getLabel(deal, field, fieldCtx) : field.name }
                    </div>

                    <div className={cn('field', { editable: true, approved, disabled })}>
                      <Editable
                        field={field}
                        context={fieldCtx}
                        editable={editable}
                        disabled={disabled}
                        approved={approved}
                        isBackOffice={isBackOffice}
                        saving={saving}
                        onChange={(field, value) => this.onChangeContext(field, value)}
                      />

                      {
                        saving && saving === field.key &&
                        <i className="fa fa-spin fa-spinner" />
                      }
                    </div>
                  </div>

                  <div className="approve-row">
                    {
                      isBackOffice && fieldCtx.value && !approved && saving !== field.key &&
                      <button
                        className="btn-approve"
                        onClick={(e) => this.approveField(e, field, fieldCtx)}
                      >
                        Approve
                      </button>
                    }
                  </div>
                </div>
              )
            })
            .value()
          }
        </div>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  checklists: deals.checklists,
  isBackOffice: deals.backoffice
}), { notify, updateContext, createGenericTask, changeNeedsAttention })(Table)
