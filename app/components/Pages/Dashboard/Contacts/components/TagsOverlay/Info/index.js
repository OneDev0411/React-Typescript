import React from 'react'
import Flex from 'styled-flex-component'
import Cookies from 'universal-cookie'

import CloseButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

export const TagInfoContainer = Flex.extend`
  border-radius: 3px;
  background-color: #dce5eb;
  margin-bottom: 1em;
  padding: 1em;
  font-size: 16px;
  line-height: 1.5;
`
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
      <TagInfoContainer alignCenter justifyBetween>
        Tags are unique identifiers that you can use to make your contacts more
        human and allow you to filter contacts easier.
        <CloseButton iconSize="large" inverse onClick={this.onClose}>
          <CloseIcon />
        </CloseButton>
      </TagInfoContainer>
    )
  }
}
