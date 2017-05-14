import React from 'react'
import { Link } from 'react-router'
import S from 'shorti'
import AppDispatcher from '../dispatcher/AppDispatcher'
import AppStore from '../stores/AppStore'
import SideBar from './Pages/Dashboard/Partials/SideBar'
import MobileNav from './Pages/Dashboard/Partials/MobileNav'

export default class Dashboard extends React.Component {

  componentDidMount() {
    const { data } = this.props
    const { user } = data

    if (!user)
      return

    AppStore.data.user = user
    AppStore.emitChange()

    // check for mobile
    this.checkForMobile()
  }

  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }

  render() {
    const { data, user } = this.props

    let main_style = { marginLeft: '60px', minHeight: '100vh' }
    let nav_area = <SideBar data={data} />

    if (data.is_mobile) {
      main_style = { ...main_style, ...S('') }

      if (user)
        nav_area = <MobileNav data={data} />
    }

    const children = React.cloneElement(this.props.children, {
      data,
      user: data.user
    })

    return (
      <div>
        { nav_area }
        <div style={main_style}>
          { children }
        </div>
      </div>
    )
  }
}
