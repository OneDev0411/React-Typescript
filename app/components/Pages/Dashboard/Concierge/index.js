import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'

export default class Concierge extends Component {

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

    let main_style = S('absolute l-70 w-100p')
    let nav_area = <SideBar data={ data } />

    if (data.is_mobile) {
      main_style = { ...main_style, ...S('l-0 w-100p') }

      if (user)
        nav_area = <MobileNav data={ data } />
    }

    return (
      <div>
        <main>
          { nav_area }
          <div className="concierge" style={ main_style }>
            <Link to="/dashboard/concierge/deals">Deals</Link>
          </div>
        </main>
      </div>
    )
  }
}

Concierge.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}
