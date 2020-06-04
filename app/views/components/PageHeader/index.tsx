import React, { CSSProperties, ReactNode } from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import styled from 'styled-components'

import Menu from './Menu'
import { PageTitle } from './PageTitle'
import { Subtitle } from './PageTitle/Subtitle'
import { H1 } from '../Typography/headings'

const Container = styled.div<{ isFlat?: boolean }>`
  width: calc(100% - 3em);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5em 0;
  margin: 0 1.5em 1.5em;
`

interface Props {
  backUrl?: string
  showBackButton?: boolean
  isFlat?: boolean
  title?: string
  maxTitleLength?: number
  subtitle?: string
  style?: CSSProperties
  className?: string
  children?: ReactNode
  onClickBackButton?: (event: React.MouseEvent) => void
  onClickCloseButton?: (event: React.MouseEvent) => void
}

const defaultProps = {
  backUrl: '',
  showBackButton: true,
  isFlat: false,
  style: {},
  title: '',
  maxTitleLength: 1000,
  subtitle: '',
  className: ''
}

function PageHeader(props: Props & WithRouterProps) {
  let { title, backUrl, location } = props

  if (location.state && location.state.previousPage) {
    backUrl = location.state.previousPage.url || backUrl
    title = location.state.previousPage.title || title
  }

  return (
    <Container
      isFlat={props.isFlat}
      style={props.style}
      className={props.className}
    >
      {title && (
        <PageTitle
          showBackButton={props.showBackButton}
          onClickBackButton={props.onClickBackButton}
          onClickCloseButton={props.onClickCloseButton}
          backUrl={backUrl}
          title={title}
          maxTitleLength={props.maxTitleLength}
          subtitle={props.subtitle}
        />
      )}
      {props.children}
    </Container>
  )
}

PageHeader.defaultProps = defaultProps

PageHeader.Menu = Menu
PageHeader.Title = PageTitle
PageHeader.Heading = H1
PageHeader.Subtitle = Subtitle

export default withRouter(PageHeader)
