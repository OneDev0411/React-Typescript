import React, { Fragment } from 'react'
import cn from 'classnames'
import {
  getActivatedBrandId,
  changeActiveBrand
} from '../../../../../../utils/user-brands'
import flattenBrand from '../../../../../../utils/flatten-brand'
import Avatar from '../../../../../Partials/UserAvatar'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      savingBrand: false
    }
  }

  getAvatar(brand) {
    const flatted = flattenBrand(brand)
    const primaryColor = flatted.palette.primary

    return (
      <Avatar
        round
        showStateIndicator={false}
        name={flatted.name}
        size={30}
        src={flatted.assets ? flatted.assets.site_logo : null}
        color={primaryColor}
        fgColor={
          primaryColor && primaryColor.toLowerCase() === '#ffffff' ? '#000' : '#fff'
        }
      />
    )
  }

  changeBrand(e, account) {
    e.preventDefault()

    const { user } = this.props
    const { savingBrand } = this.state

    if (savingBrand || account.brand.id === getActivatedBrandId(user)) {
      return false
    }

    this.setState({ savingBrand: account.brand.id })
    changeActiveBrand(account.brand.id)
    window.location.reload(true)
  }

  render() {
    const { user } = this.props
    const { savingBrand } = this.state

    if (!user.brands || user.brands.length <= 1) {
      return false
    }

    return (
      <Fragment>
        <li className="separator">Switch Accounts</li>
        {user.brands.map(account => {
          const isActiveBrand = account.brand.id === getActivatedBrandId(user)

          return [
            <li key={account.brand.id} className="brand-account">
              <a href="#" onClick={e => this.changeBrand(e, account)}>
                {this.getAvatar(account.brand)}

                <div className={cn('brand-title', { active: isActiveBrand })}>
                  {account.brand.name}
                </div>

                <div className="icon">
                  {!savingBrand &&
                    isActiveBrand && (
                      <img src="/static/images/dashboard/checkmark.svg" alt="" />
                    )}

                  {savingBrand === account.brand.id && (
                    <i className="fa fa-spinner fa-spin" />
                  )}
                </div>
              </a>
            </li>,
            <li
              key={`sp_${account.brand.id}`}
              role="separator"
              className="divider"
            />
          ]
        })}
      </Fragment>
    )
  }
}
