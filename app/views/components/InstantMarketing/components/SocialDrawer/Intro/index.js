import React from 'react'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import TextLinkIcon from './images/TextLink'
import ReceivePostIcon from './images/ReceivePost'

import {
  IntroContainer,
  Section,
  SectionImage,
  Title,
  Description,
  Divider,
  CloseButton
} from './styled'

export class HelpIntro extends React.Component {
  state = {
    isVisible: true
  }

  handleClose = () => this.setState({ isVisible: false })

  render() {
    if (this.state.isVisible === false) {
      return false
    }

    return (
      <IntroContainer>
        <CloseButton onClick={this.handleClose}>
          <CloseIcon style={{ width: '0.875rem' }} />
        </CloseButton>

        <Section>
          <SectionImage>
            <TextLinkIcon />
          </SectionImage>

          <Title>Step 1: Text The Link</Title>

          <Description>
            Send the link to yourself and others you want to promote the
            listing.
          </Description>
        </Section>

        <Divider />

        <Section>
          <SectionImage>
            <ReceivePostIcon />
          </SectionImage>

          <Title>Step 2: Receive & Post</Title>

          <Description>
            Got the text? great. tap the link to view your design and post it.
          </Description>
        </Section>
      </IntroContainer>
    )
  }
}
