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
    const { isBackOffice } = this.props
    if (!field.canEdit(isBackOffice)) {
      return false
    }

    this.setState({
      selectedField: field.key,
      showDatePicker: true
    })
  }

  async changeCriticalDate(date) {
    const { deal, updateContext } = this.props
    const { selectedField } = this.state

    // hide picker
    this.hideModal()

    // set state
    this.setState({ saving: selectedField })

    // update context
    await updateContext(deal.id, { [selectedField]: date })

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
    const { saving } = this.state
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
          onClose={() => this.hideModal()}
          onSelectDate={date => this.changeCriticalDate(date)}
        />

        <table className="fact-table critical-dates">
          <tbody>
            {
              _.chain(table)
              .filter(field => field.side === filter)
              .map(field => {
                const date = getDate(deal, field.key)
                const editable = field.canEdit(isBackOffice)

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
                      className={`field ${editable ? 'editable' : ''}`}
                      onClick={() => this.editField(field)}
                    >
                      { date.value }

                      {
                        saving && saving === field.key &&
                        <i className="fa fa-spin fa-spinner" />
                      }

                      <span className="cta">
                        { editable ?
                          <i className="fa fa-pencil" />:
                          <i
                            className="fa fa-lock"
                            data-tip="Please contact your admin to update this date."
                          />
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
