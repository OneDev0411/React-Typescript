import React from 'react'
import { Link } from 'react-router'
import S from 'shorti'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'

export default class Deals extends React.Component {

  componentDidMount() {
    const { data } = this.props
    const { user } = data

    if (!user)
      return

    AppStore.data.user = user
    AppStore.emitChange()

    this.checkForMobile()
  }

  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }

  render() {
    const { data } = this.props
    const user = data.user

    let main_style = S('ml-5p h-100p')
    let nav_area = <SideBar data={ data } />

    if (data.is_mobile) {
      main_style = { ...main_style, ...S('') }

      if (user)
        nav_area = <MobileNav data={ data } />
    }

    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        user,
        deals: data.deals,
        forms: data.deals_forms
      })
    )

    return (
      <div>
        { nav_area }
        <div className="deals" style={ main_style }>
          { children }
        </div>
      </div>
    )
  }
}

Deals.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}
