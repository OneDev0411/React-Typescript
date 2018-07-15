import React from 'react'
import Flex from 'styled-flex-component'
import Cookies from 'universal-cookie'

import CloseButton from '../../../../../../../views/components/Button/IconButton'
import CloseIcon from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'

export const TaginfoContainer = Flex.extend`
  border-radius: 3px;
  background-color: #dce5eb;
  margin-bottom: 1em;
  padding: 1em;
  font-size: 16px;
  line-height: 1.5;
  color: #1e364b;
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
      <TaginfoContainer alignCenter justifyBetween>
        Tags are unique identifiers that you can use to make your contacts more
        human and allow you to filter contacts easier.
        <CloseButton
          color="#7b91a6"
          hoverColor="#262626"
          onClick={this.onClose}
          size="20px"
        >
          <CloseIcon />
        </CloseButton>
      </TaginfoContainer>
    )
  }
}
