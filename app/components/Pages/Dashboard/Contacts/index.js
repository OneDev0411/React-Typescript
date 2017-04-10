import React  from 'react'
import Dispatcher from '../../../../dispatcher/ContactDispatcher'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { data } = this.props
    const { user } = data

    // get deals
    this.getContacts(user)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.namespace === 'contacts'
  // }

  getContacts(user) {
    Dispatcher.dispatch({
      action: 'get-contacts',
      user
    })
  }

  render() {
    const { data } = this.props
    const user = data.user

    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        user,
        contacts: data.contacts
      })
    )

    return (
      <div className="crm">
        <div className="contacts">
          {
            !data.contacts &&
            <div className="loading-contacts">
              <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
              <b>loading contacts ...</b>
            </div>
          }

          { data.contacts && children }
        </div>
      </div>
    )
  }
}
