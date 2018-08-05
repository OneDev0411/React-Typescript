import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import IconCalendar from '../../../../../../views/components/SvgIcons/Calender/IconCalendar'
import getCalenderFeed from '../../../../../../models/user/generate-calender-feed'
import LinkIcon from '../../../../../../views/components/SvgIcons/LinkIcon'
import {
  GenerateUrlContainer,
  GenerateUrlText,
  GenerateUrlButton,
  FeedUrl
} from './styled'

class GenerateUrl extends React.Component {
  state = {
    isFetchingFeed: false,
    feedURl: ''
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.feedURl !== '' &&
      !_.isEqual(nextProps.selectedTypes, this.props.selectedTypes)
    ) {
      this.setState({ feedURl: '' })
    }
  }

  generateUrlClick = async () => {
    try {
      this.setState({ isFetchingFeed: true })

      const feedURl = await getCalenderFeed(
        this.props.selectedTypes,
        this.props.selectedBrandId
      )

      this.setState({ feedURl })
    } catch (e) {
      console.log(e)
      this.props.notify({
        title: 'Could not get calender feed URL',
        status: 'error',
        dismissible: true
      })
    } finally {
      this.setState({ isFetchingFeed: false })
    }
  }

  render() {
    const { isFetchingFeed, feedURl } = this.state

    return (
      <GenerateUrlContainer>
        <IconCalendar />
        <GenerateUrlText> iCAL Feed URL:</GenerateUrlText>
        {feedURl ? (
          <Fragment>
            <FeedUrl> {feedURl}</FeedUrl>
            <LinkIcon
              style={{
                position: 'absolute',
                right: '1.4rem'
              }}
            />
          </Fragment>
        ) : (
          <GenerateUrlButton
            onClick={this.generateUrlClick}
            disabled={isFetchingFeed || this.props.selectedTypes.length === 0}
          >
            {`Generate URL${isFetchingFeed ? '...' : ''}`}
          </GenerateUrlButton>
        )}
      </GenerateUrlContainer>
    )
  }
}

export default connect(
  null,
  { notify }
)(GenerateUrl)
