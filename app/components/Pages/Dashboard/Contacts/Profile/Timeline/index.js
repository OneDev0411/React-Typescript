import React from 'react'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'

export default class Timeline extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  create(id, activity) {
    let attributes = {}

    // action
    console.log('Action: ', activity.action)

    if (this[activity.action])
      attributes = this[activity.action](activity)

    // set time
    attributes.time = moment.unix(activity.created_at).fromNow()

    return this.renderItem(id, attributes)
  }

  UserViewedAlert(activity) {
    return {}
  }

  UserViewedListing(activity) {
    return {}
  }

  UserFavoritedListing(activity) {
    return {}
  }

  UserSharedListing(activity) {
    return {}
  }

  UserCreatedAlert(activity) {
    return {
      title: activity.object.users[0].display_name + ' created an alert'
    }
  }

  UserCommentedRoom(activity) {
    return {}
  }

  UserOpenedIOSApp(activity) {
    return {}
  }

  UserCalledContact(activity) {
    return {}
  }

  UserCreatedContact(activity) {
    return {
      title: activity.object.users[0].display_name + ' created a contact'
    }
  }

  UserCreatedNote(activity) {
    return {}
  }

  UserSignedUp(activity) {
    return {}
  }

  addListingToTitle(notification) {
    let listing = notification.listing
    addListingToTitle(listing: listing)
  }

  // addListingToTitle(listing) {
  //   activityImageView.sd_setImageWithURLString(
  //       listing.coverImageURL,
  //       placeholderImage: UIImage(named: "house3")!,
  //       animated: true
  //   )

  //   var string = "\(listing.property.address.streetNumber) \(listing.property.address.streetName)"
  //   if let newString = listing.property.address.streetSuffix {
  //       string = string + " " + newString
  //   }
  //   if let newString = listing.property.address.unitNumber {
  //       if newString != "" {
  //           string = string + ", Unit " + newString
  //       }
  //   }
  // }

    //     titleLabel.text! += "\"" + string + "\""
    // }

    // func addListingToTitle(activity: Activity) {
    //     var listing: Listing?

    //     if let message = activity.object as? Message {
    //         listing = message.recommendation?.listing
    //     } else if let recommendation = activity.object as? Recommendation {
    //         listing = recommendation.listing
    //     } else if let aListing = activity.object as? Listing {
    //         listing = aListing
    //     }

    //     if let listing = listing {
    //         addListingToTitle(listing: listing)
    //     }
    // }

    // func addAlertToTitle(activity: Activity) {
    //     if let alert = activity.object as? Alert {
    //         if alert.title == nil || alert.title!.characters.count == 0 {
    //             titleLabel.text! += "\"" + alert.proposedTitle + "\""
    //         } else {
    //             titleLabel.text! += "\"" + alert.title! + "\""
    //         }
    //     }
    // }

  renderItem(key, attributes) {
    return (
      <Row className="event" key={`timeline_item_${key}`}>
        <Col sm={1} xs={1} className="image">
          <img src="https://cdn.rechat.com/62230287.jpg" />
        </Col>
        <Col sm={9} xs={9}>
          <div className="desc">{ attributes.title }</div>
          <div className="time">
            <img src="/static/images/contacts/heart@3x.png" />
            { attributes.time }
          </div>
        </Col>
      </Row>
    )
  }

  render() {
    return (
      <div>
        {
          _.map(this.props.activities, (activity, id) => {
            return this.create(id, activity)
          })
        }
      </div>
    )
  }
}
