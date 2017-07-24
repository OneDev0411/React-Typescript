import React from 'react'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import Avatar from 'react-avatar'
import _ from 'underscore'
import Contact from '../../../../../../models/Contact'
import { getFieldValue } from '../../../../../../utils/helpers'

export default class Timeline extends React.Component {

  constructor(props) {
    super(props)
  }

  create(id, activity) {
    let attributes = {}

    if (activity.object === null) {
      return false
    }

    if (this[activity.action])
      attributes = this[activity.action](activity)

    // set time
    attributes.time = moment.unix(activity.created_at).fromNow()

    return this.renderItem(id, attributes)
  }

  UserViewedAlert(activity) {
    return {
      title: `${this.props.name} <b>viewed an alert</b> ` + this.getAlertTitle(activity),
      icon: 'alert-fill'
    }
  }

  UserViewedListing(activity) {
    return {
      title: `${this.props.name} <b>viewed</b> ` + this.getListingTitle(activity),
      image: this.getListingPhoto(activity.object),
      url: this.getListingUrl(activity.object),
      icon: 'group-142'
    }
  }

  UserFavoritedListing(activity) {
    return {
      title: `${this.props.name} <b>favorited</b> ` + this.getListingTitle(activity),
      image: this.getListingPhoto(activity.object),
      url: this.getListingUrl(activity.object),
      icon: 'heart'
    }
  }

  UserSharedListing(activity) {
    return {
      title: `${this.props.name} <b>shared</b> ` + this.getListingTitle(activity),
      image: this.getListingPhoto(activity.object),
      url: this.getListingUrl(activity.object),
      icon: 'group-142'
    }
  }

  UserCreatedAlert(activity) {
    return {
      title: `${this.props.name} <b>created an alert</b> ` + this.getAlertTitle(activity),
      icon: 'alert-fill'
    }
  }

  UserCommentedRoom(activity) {
    return {
      title: `${this.props.name} <b>Commented on</b> ` + this.getListingTitle(activity),
      icon: 'comment'
    }
  }

  UserOpenedIOSApp(activity) {
    return {
      title: `${this.props.name} <b>was active</b> in iOS`,
      icon: 'alert-fill'
    }
  }

  UserCalledContact(activity) {
    return {
      title: `You called ${this.props.name}`,
      icon: 'alert-fill'
    }
  }

  UserCreatedContact(activity) {
    const sourceType = Contact.get.source(activity.object).name
    let title = 'Contact created'

    switch (sourceType) {
      case 'BrokerageWidget':
        title += ' from brokerage widget'
        break
      case 'IOSAddressBook':
        title += ' from your address book'
        break
      case 'SharesRoom':
        title += ' because you shared a room with this user'
        break
      case 'ExplicitlyCreated':
        title += ' by you'
        break
    }

    return {
      title,
      icon: 'alert-fill'
    }
  }

  UserInvited(activity) {
    return {
      title: `${this.props.name} <b>was invited</b> to Rechat`,
      icon: 'alert-fill'
    }
  }

  UserSignedUp(activity) {
    return {
      title: `${this.props.name} signed up to Rechat`,
      icon: 'alert-fill'
    }
  }

  addListingToTitle(notification) {
    let listing = notification.listing
    addListingToTitle(listing: listing)
  }

  getListingTitle(activity) {
    const type = activity.object.type
    let listing
    let title

    if (type === 'message')
      listing = activity.object.recommendation.listing
    else if (type === 'recommendation')
      listing = activity.object.listing
    else if (type === 'listing')
      listing = activity.object

    if (!listing)
      return ''

    // get address object
    const { address }  = listing.property

    title = address.street_number
    title += ' ' + address.street_name

    if (address.street_suffix)
      title += ' ' + address.street_suffix

    if (address.unit_number)
      title += ', Unit ' + address.unit_number

    return title
  }

  getAlertTitle(activity) {
    const alert = activity.object
    const { title, proposed_title } = alert
    return (title && title.length > 0) ? title : proposed_title
  }

  getListingPhoto(listing) {
    if (!listing || !listing.cover_image_url)
      return '/static/images/deals/home.svg'

    return listing.cover_image_url
  }

  getListingUrl(listing) {
    return `/dashboard/mls/${listing.id}`
  }

  renderItem(key, attributes) {
    const image = attributes.image ?
      <img src={attributes.image} /> :
      <Avatar
        round
        name={this.props.name}
        src={this.props.avatar}
        size={34}
      />

    const activity = (
      <Row className="event" >
        <Col sm={1} xs={1} className="image">
          { image }
        </Col>
        <Col sm={9} xs={9}>
          <div
            className="desc"
            dangerouslySetInnerHTML={{ __html: attributes.title }}
          ></div>
          <div className="time">
            <img src={`/static/images/contacts/${attributes.icon}@3x.png`} />
            { attributes.time }
          </div>
        </Col>
      </Row>
    )

    if (attributes.url) {
      return (
        <a
          href={attributes.url}
          target="_blank"
          key={`timeline_item_${key}`}
        >
          { activity }
        </a>
      )
    }

    return React.cloneElement(activity, {
      key: `timeline_item_${key}`
    })
  }

  render() {
    const { activities, name } = this.props

    if (_.size(activities) === 0) {
      return (
        <div className="no-activity">
          <img src="/static/images/contacts/activity.svg" />
          <p>{ name } has no activity right now</p>
        </div>
      )
    }

    return (
      <div>
        {
          _.map(activities, (activity, id) => {
            return this.create(id, activity)
          })
        }
      </div>
    )
  }
}
