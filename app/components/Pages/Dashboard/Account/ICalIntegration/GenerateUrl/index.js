import styled from "styled-components"
import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import copy from '../../../../../../utils/copy-text-to-clipboard'
import IconCalendarBase from '../../../../../../views/components/SvgIcons/Calender/IconCalendar'
import getCalenderFeed from '../../../../../../models/user/generate-calender-feed'
import Button from '../../../../../../views/components/Button/ActionButton'
import { GenerateUrlContainer, GenerateUrlText, FeedUrl } from './styled'

const IconCalendar = styled(IconCalendarBase)`
  > g {
    fill: #000000;
  }
`

class GenerateUrl extends React.Component {
  state = {
    isFetchingFeed: false,
    feedURl: this.props.feedURl
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.feedURl !== '' &&
      (!_.isEqual(nextProps.selectedMembers, this.props.selectedMembers) ||
        !_.isEqual(nextProps.selectedTypes, this.props.selectedTypes))
    ) {
      this.setState({ feedURl: '' })
    }
  }

  generateUrlClick = async () => {
    try {
      this.setState({ isFetchingFeed: true })

      const { userTeams, selectedMembers } = this.props

      const filter = userTeams
        .filter(({ brand }) => selectedMembers[brand.id])
        .map(({ brand }) => {
          if (brand.member_count === selectedMembers[brand.id].length) {
            return { brand: brand.id }
          }

          return { brand: brand.id, users: selectedMembers[brand.id] }
        })

      const feedURl = await getCalenderFeed(this.props.selectedTypes, filter)

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
        <GenerateUrlText>Calendar Export URL:</GenerateUrlText>
        {feedURl ? (
          <FeedUrl
            appearance="link"
            onClick={event => {
              event.preventDefault()
              copy(feedURl)
              this.props.notify({
                message: 'Link Copied',
                status: 'success'
              })

              return false
            }}
            href={feedURl}
          >
            {feedURl}
          </FeedUrl>
        ) : (
          <Button
            style={{ marginLeft: '1em' }}
            onClick={this.generateUrlClick}
            disabled={isFetchingFeed || this.props.selectedTypes.length === 0}
          >
            {`Generate URL${isFetchingFeed ? '...' : ''}`}
          </Button>
        )}
      </GenerateUrlContainer>
    )
  }
}

export default connect(
  null,
  { notify }
)(GenerateUrl)
