import React, { Component } from 'react'
import S from 'shorti'
import AppStore from '../../../../../stores/AppStore'
import SideBar from '../../Partials/SideBar'
import MobileNav from '../../Partials/MobileNav'
import moment from 'moment'

export default class Deals extends Component {

  constructor(props) {
    super(props)
    this.state = {
      deal: AppStore.data.concierge_deals
        .find(d => d.id === props.params.id)
    }
  }

  componentDidMount() {
  }

  render() {
    const { data } = this.props
    const user = data.user

    let main_style = S('absolute h-100p l-70 r-0')
    let nav_area = <SideBar data={ data } />

    if (data.is_mobile) {
      main_style = { ...main_style, ...S('l-0 w-100p') }

      if (user)
        nav_area = <MobileNav data={ data } />
    }

    const { deal } = this.state

    return (
      <div style={ S('minw-1000') }>
        <main>
          { nav_area }
          <div className="deals" style={ main_style }>
            <h3>Deals</h3>
            <table>
              <thead>
                <tr>
                  <td>NAME</td>
                  <td>TYPE</td>
                  <td>MIME</td>
                  <td>DATE CREATED</td>
                </tr>
              </thead>
              <tbody>
                {
                  deal.files && deal.files.map(file => {
                    return (
                      <tr key={`FILE_${file.id}`}>
                        <td>{ file.name }</td>
                        <td>{ file.type }</td>
                        <td>{ file.mime }</td>
                        <td>{ moment(file.created_at * 1000).format('Y/M/D HH:mm') }</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </main>
      </div>
    )
  }
}

Deals.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}
