import React from 'react'

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
    if (!this.props.validateCommission(value)) {
      return false
    }

    this.props.onChange(this.getCommissionField(), value)
  }

  /**
   * set form commission type
   */
  setCommissionType(type) {
    const { form } = this.props

    delete form[this.getCommissionField()]

    this.setState({ commission_type: type }, () => this.setCommission(''))
  }

  /**
   * get commission field name
   */
  getCommissionField() {
    const { commission_type } = this.state

    return (commission_type === '%') ?
      'commission_percentage' :
      'commission_dollar'
  }

  /**
   * get commission value
   */
  getCommissionValue() {
    const { form } = this.props
    return form[this.getCommissionField()]
  }

  /**
   * get commission type
   */
  getCommissionType(form) {
    if (form.isNewRecord) {
      return '%'
    }

    return form.commission_percentage ? '%' : '$'
  }

  /**
   * check whether should show commission field or not
   */
  shouldShowCommission(form) {
    return ['CoBuyerAgent', 'BuyerAgent', 'BuyerReferral',
      'CoSellerAgent', 'SellerAgent', 'SellerReferral'].indexOf(form.role) > -1
  }

  render() {
    const { form } = this.props
    const { commission_type } = this.state

    if (!this.shouldShowCommission(form)) {
      return false
    }

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
          <input
            id="commission"
            required="required"
            placeholder="Commission"
            shrink={50}
            type="number"
            value={this.getCommissionValue()}
            onChange={e => this.setCommission(e.target.value)}
          />
        </div>

      </div>
    )
  }
}
