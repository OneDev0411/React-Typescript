import React from 'react'
import Cookies from 'universal-cookie'

import CloseIcon from '../../../../../../views/components/SvgIcons/Close/CloseIcon'
import IconButton from '../../../../../../views/components/Button/IconButton'
import { InfoContainer, InfoLeftSide, InfoText, AlertIcon } from './styled'

export default class UpdateGenerateUrlInfo extends React.Component {
  constructor(props) {
    super(props)
    this.cookies = new Cookies()
    this.state = { closeICalInfo: this.cookies.get('closeICalInfo') }
  }
  onClose = () => {
    this.cookies.set('closeICalInfo', true)
    this.setState({ closeICalInfo: this.cookies.get('closeICalInfo') })
  }

  render() {
    const { closeICalInfo } = this.state

    if (closeICalInfo) {
      return null
    }

    return (
      <InfoContainer>
        <InfoLeftSide>
          <AlertIcon />
          <InfoText>
            Don’t forget to generate a new URL whenever you change your event
            type selection and copy and paste it into all the calendars you use.
          </InfoText>
        </InfoLeftSide>
        <IconButton isFit iconSize="large" inverse onClick={this.onClose}>
          <CloseIcon />
        </IconButton>
      </InfoContainer>
    )
  }
}
