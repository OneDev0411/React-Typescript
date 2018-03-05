import React from 'react'
import NumericInput from '../../../../../../../views/components/Input/NumericInput'
import CurrencyInput from '../../../../../../../views/components/Input/CurrencyInput'

export default class Commission extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      commission_type: this.getCommissionType(props.form)
    }
  }

  /**
   * set form commission
   */
  setCommission(value) {
    const { onChange, validateCommission } = this.props

    const number = validateCommission(value) ? value : this.getCommissionValue()

    onChange(this.getCommissionField(), number)
  }

  /**
   * set form commission type
   */
  setCommissionType(type) {
    const { onChange } = this.props

    // reset current value
    onChange(this.getCommissionField(), 0)

    this.setState({ commission_type: type }, () => this.setCommission(''))
  }

  /**
   * get commission field name
   */
  getCommissionField() {
    const { commission_type } = this.state

    return commission_type === '%'
      ? 'commission_percentage'
      : 'commission_dollar'
  }

  /**
   * get commission value
   */
  getCommissionValue() {
    const { form } = this.props

    return form[this.getCommissionField()] || ''
  }

  /**
   * get commission type
   */
  getCommissionType(form) {
    if (!form.commission_percentage && !form.commission_dollar) {
      return '%'
    }

    return form.commission_percentage ? '%' : '$'
  }

  /**
   * check whether should show commission field or not
   */
  static shouldShowCommission(form) {
    return (
      [
        'CoBuyerAgent',
        'BuyerAgent',
        'BuyerReferral',
        'CoSellerAgent',
        'SellerAgent',
        'SellerReferral'
      ].indexOf(form.role) > -1
    )
  }

  render() {
    const { form, isRequired } = this.props
    const { commission_type } = this.state

    if (!Commission.shouldShowCommission(form)) {
      return false
    }

    const placeholder = `Enter commission for this agent ${
      isRequired ? '*' : ''
    }`

    return (
      <div className="commission-row">
        <input
          className="radio"
          type="radio"
          name="commission_type"
          checked={commission_type === '%'}
          onChange={() => this.setCommissionType('%')}
        />&nbsp;&nbsp;%
        <input
          className="radio"
          type="radio"
          name="commission_type"
          checked={commission_type === '$'}
          onChange={() => this.setCommissionType('$')}
        />&nbsp;&nbsp;$
        <div className="commission">
          {commission_type === '%' ? (
            <NumericInput
              name="commission"
              min={0}
              max={100}
              options={{
                allowDecimal: true,
                includeThousandsSeparator: false,
                integerLimit: 3
              }}
              placeholder={placeholder}
              value={this.getCommissionValue()}
              onChange={e => {
                this.setCommission(e.target.value)
              }}
            />
          ) : (
            <CurrencyInput
              name="commission"
              value={this.getCommissionValue()}
              onChange={(e, data) => {
                this.setCommission(data.value)
              }}
            />
          )}
        </div>
      </div>
    )
  }
}
