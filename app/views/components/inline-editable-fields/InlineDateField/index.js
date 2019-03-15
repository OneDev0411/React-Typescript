import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'
import { addZero } from 'utils/date-times/add-zero'

import { InlineEditableField } from '../InlineEditableField'
import { EditMode } from './EditMode'
import { getDateValues, parseDateValues } from './helpers'

const INITIAL_STATE = {
  disabled: false,
  showYear: false,
  ...getDateValues()
}

export class InlineDateField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      disabled: false,
      showYear: !this.props.yearIsOptional,
      ...getDateValues(props.date)
    }
  }

  static propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
    handleAddNew: PropTypes.func,
    date: PropTypes.number,
    isYearOptional: PropTypes.bool,
    label: PropTypes.string.isRequired,
    showAdd: PropTypes.bool,
    showEdit: PropTypes.bool,
    showDelete: PropTypes.bool
  }

  static defaultProps = {
    date: null,
    handleDelete: noop,
    handleAddNew: noop,
    isYearOptional: false,
    showAdd: false,
    showDelete: true,
    showEdit: true
  }

  get value() {
    let {
      day: { value: day },
      month: { value: month },
      year
    } = this.state

    if (day == null || month == null) {
      return '-'
    }

    if (!year || year === 1800) {
      year = ''
    } else {
      year = `/${year}`
    }

    return `${addZero(month + 1)}/${addZero(day)}${year}`
  }

  onChangeDay = day => this.setState({ day })

  onChangeMonth = month => this.setState({ month })

  onChangeYear = year => this.setState({ year })

  toggleYearOption = showYear => this.setState({ showYear })

  save = async toggleMode => {
    try {
      this.setState({ disabled: true })
      await this.props.handleSave(parseDateValues(this.state))
      this.setState({ disabled: false }, toggleMode)
    } catch (error) {
      console.log(error)
      this.setState({ disabled: false })
    }
  }

  delete = async toggleMode => {
    try {
      this.setState({ disabled: true })
      await this.props.handleDelete()
      this.setState(INITIAL_STATE, toggleMode)
    } catch (error) {
      console.log(error)
      this.setState({ disabled: false })
    }
  }

  renderEditMode = props => (
    <EditMode
      {...props}
      {...this.state}
      label={this.props.label}
      onChangeDay={this.onChangeDay}
      onChangeYear={this.onChangeYear}
      onChangeMonth={this.onChangeMonth}
      toggleYearOption={this.toggleYearOption}
    />
  )

  render() {
    return (
      <InlineEditableField
        isDisabled={this.state.disabled}
        label={this.props.label}
        handleSave={this.save}
        handleDelete={this.delete}
        showDelete={this.props.showDelete}
        renderEditMode={this.renderEditMode}
        value={this.value}
      />
    )
  }
}
