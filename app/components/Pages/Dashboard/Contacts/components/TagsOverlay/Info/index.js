import React from 'react'
import Flex from 'styled-flex-component'
import Cookies from 'universal-cookie'

import CloseIcon from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'

export const Container = Flex.extend`
  border-radius: 3px;
  background-color: #dce5eb;
  padding: 1em;
  font-size: 16px;
  line-height: 1.5;
  color: #1e364b;
`

const IconContainer = Flex.extend`
  cursor: pointer;
  margin-left: 1em;
  :hover {
    svg > path.svg-icon--close {
      fill: #262626;
    }
  }
`

export default class TagsOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.cookies = new Cookies()
    this.state = { closeTagInfo: this.cookies.get('closeTagInfo') }
  }
  onclick = () => {
    this.cookies.set('closeTagInfo', true)
    this.setState({ closeTagInfo: this.cookies.get('closeTagInfo') })
  }
  render() {
    const { closeTagInfo } = this.state

    if (closeTagInfo) {
      return null
    }

    return (
      <Container alignCenter justifyBetween>
        Tags are unique identifiers that you can use to make your contacts more
        human and allow you to filter contacts easier.
        <IconContainer center>
          <CloseIcon color="#7b91a6" onClick={this.onclick} />
        </IconContainer>
      </Container>
    )
  }
}
