import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Box, Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import _ from 'underscore'
import { mdiCalendarMonthOutline } from '@mdi/js'

import copy from '../../../../../../utils/copy-text-to-clipboard'
import { SvgIcon } from '../../../../../../views/components/SvgIcons/SvgIcon'
import getCalenderFeed from '../../../../../../models/user/generate-calender-feed'
import { GenerateUrlContainer, GenerateUrlText, FeedUrl } from './styled'

class GenerateUrl extends React.Component {
  state = {
    isFetchingFeed: false,
    feedURl: this.props.feedURl,
    errorMessage: ''
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
      <>
        {errorMessage && (
          <Box marginBottom={1}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
        <GenerateUrlContainer>
          <SvgIcon path={mdiCalendarMonthOutline} />
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
      </>
    )
  }
}

export default connect(null, { notify })(GenerateUrl)
