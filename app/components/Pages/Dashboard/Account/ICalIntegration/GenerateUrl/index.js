import styled from 'styled-components'
import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Box, Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import _ from 'underscore'

import copy from '../../../../../../utils/copy-text-to-clipboard'
import IconCalendarBase from '../../../../../../views/components/SvgIcons/Calender/IconCalendar'
import getCalenderFeed from '../../../../../../models/user/generate-calender-feed'
import { GenerateUrlContainer, GenerateUrlText, FeedUrl } from './styled'

const IconCalendar = styled(IconCalendarBase)`
  > g {
    fill: #000000;
  }
`

class GenerateUrl extends React.Component {
  state = {
    isFetchingFeed: false,
    feedURl: this.props.feedURl,
    errorMessage: ''
  }

  componentWillReceiveProps(nextProps) {
    const selectedMembersChanged = !_.isEqual(
      nextProps.selectedMembers,
      this.props.selectedMembers
    )
    const selectedTypesChanged = !_.isEqual(
      nextProps.selectedTypes,
      this.props.selectedTypes
    )

    if (
      this.state.feedURl !== '' &&
      (selectedMembersChanged || selectedTypesChanged)
    ) {
      this.setState({ feedURl: '' })
    }

    if (selectedMembersChanged || selectedTypesChanged) {
      this.setState({ errorMessage: '' })
    }
  }

  generateUrlClick = async () => {
    try {
      const errorMessage = this.getErrorMessage

      if (errorMessage) {
        this.setState({ errorMessage })

        return null
      }

      this.setState({ isFetchingFeed: true, errorMessage })

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

  get getErrorMessage() {
    if (Object.keys(this.props.selectedMembers).length === 0) {
      return 'Please select a team or team members.'
    }

    if (this.props.selectedTypes.length === 0) {
      return 'Please select data you want to export.'
    }

    return ''
  }

  render() {
    const { isFetchingFeed, feedURl, errorMessage } = this.state

    return (
      <React.Fragment>
        {errorMessage && (
          <Box marginBottom="0.5em">
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
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
            <Box marginLeft="1em">
              <Button
                variant="contained"
                color="primary"
                disabled={isFetchingFeed || errorMessage}
                onClick={this.generateUrlClick}
              >
                {`Generate URL${isFetchingFeed ? '...' : ''}`}
              </Button>
            </Box>
          )}
        </GenerateUrlContainer>
      </React.Fragment>
    )
  }
}

export default connect(
  null,
  { notify }
)(GenerateUrl)
