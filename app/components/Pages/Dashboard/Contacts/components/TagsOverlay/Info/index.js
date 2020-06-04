import React from 'react'
import Cookies from 'universal-cookie'

import { Alert } from '@material-ui/lab'
import { Box } from '@material-ui/core'

export default class Info extends React.Component {
  constructor(props) {
    super(props)
    this.cookies = new Cookies()
    this.state = { closeTagInfo: this.cookies.get('closeTagInfo') }
  }

  onClose = () => {
    this.cookies.set('closeTagInfo', true)
    this.setState({ closeTagInfo: this.cookies.get('closeTagInfo') })
  }

  render() {
    const { closeTagInfo } = this.state

    if (closeTagInfo) {
      return null
    }

    return (
      <Box mb={2}>
        <Alert color="info" onClose={this.onClose}>
          Tags are unique identifiers that you can use to make your contacts
          more human and allow you to filter contacts easier.
        </Alert>
      </Box>
    )
  }
}
