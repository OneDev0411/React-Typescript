import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import DatePicker from './date-picker'
import { updateContext } from '../../../../../../../store_actions/deals'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      selectedField: null,
      showDatePicker: false
    }
  }

  editField(field) {
    const { isBackOffice, table } = this.props

    if (!field.canEdit(isBackOffice)) {
      return false
    }

    this.setState({
      selectedField: field.key,
      showDatePicker: true
    })
  }

  approveDate(e, field) {
    e.stopPropagation()
    const { deal, getDate } = this.props
    const date = getDate(deal, field.key)
    this.updateCriticalDate(field.key, date.value)
  }

  onChangeCriticalDate(date) {
    const { selectedField } = this.state

    this.updateCriticalDate(selectedField, date)

    // hide picker
    this.hideModal()
  }

  async updateCriticalDate(field, date) {
    const { deal, updateContext } = this.props

    // set state
    this.setState({ saving: field })

    // update context
    await updateContext(deal.id, { [field]: date })

    // set state
    this.setState({ saving: null })
  }

  hideModal() {
    this.setState({
      showDatePicker: false,
      selectedField: null
    })
  }

  render() {
    const { saving, selectedField } = this.state
    const { deal, title, showTitle, table, getDate, nextDate, filter, isBackOffice } = this.props

    return (
      <div>
        {
          showTitle &&
          <div className="deal-info-title">
            { title }
          </div>
        }

        <DatePicker
          show={this.state.showDatePicker}
          initialDate={selectedField ? getDate(deal, selectedField).value : null}
          onClose={() => this.hideModal()}
          onSelectDate={date => this.onChangeCriticalDate(date)}
        />

        <table className="fact-table critical-dates">
          <tbody>
            {
              _.chain(table)
              .filter(field => field.side === filter)
              .map(field => {
                const date = getDate(deal, field.key)
                const editable = field.canEdit(isBackOffice)
                const { approved } = date

                return (
                  <tr key={`CRITICAL_DATE_${field.key}`}>
                    <td className="name">
                      <i
                        className={cn('fa fa-circle', 'status', date.status, {
                          next: nextDate && nextDate.name === field.key
                        })}
                      />
                      { field.name }
                    </td>
                    <td
                      className={cn('field', { editable, approved })}
                      onClick={() => this.editField(field)}
                    >
                      {
                        date.value && !approved &&
                        <span
                          className="icon-not-approved"
                          data-tip="Approval is pending on this date"
                          data-place="bottom"
                        >
                          <i className="fa fa-info" />
                        </span>
                      }

                      { date.value }

                      {
                        saving && saving === field.key &&
                        <i className="fa fa-spin fa-spinner" />
                      }

                      <span className="cta">
                        { editable && !saving ?
                          <i className="fa fa-pencil" />:
                          <i
                            className="fa fa-lock"
                            data-tip="Please contact your admin to update this date."
                          />
                        }

                        {
                          isBackOffice && date.value && !approved && !saving &&
                          <button
                            className="btn-approve"
                            onClick={(e) => this.approveDate(e, field)}
                          >
                            Approve
                          </button>
                        }
                      </span>
                    </td>
                  </tr>
                )
              })
              .value()
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}), { updateContext })(Table)
