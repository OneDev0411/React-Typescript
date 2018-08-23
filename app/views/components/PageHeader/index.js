import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Menu from './Menu'
import { PageTitle } from './PageTitle'
import { Title } from './PageTitle/styled'

const Container = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
  background-color: ${props => (props.isFlat ? 'transparent' : '#fff')};
  border-bottom: ${props => (props.isFlat ? 'none' : '1px solid #e2e4e5')};
`

const propTypes = {
  backUrl: PropTypes.string,
  showBackButton: PropTypes.bool,
  isFlat: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object
}

const defaultProps = {
  showBackButton: true,
  isFlat: false,
  style: {}
}

function PageHeader(props) {
  let { title, backUrl, location } = props

  if (location.state && location.state.previousPage) {
    backUrl = location.state.previousPage.url
    title = location.state.previousPage.title
  }

  return (
    <Container isFlat={props.isFlat} style={props.style}>
      {title && (
        <PageTitle
          showBackButton={props.showBackButton}
          onClickBackButton={props.onClickBackButton}
          onClickCloseButton={props.onClickCloseButton}
          backUrl={backUrl}
          title={title}
        />
      )}
      {React.Children.map(props.children, children => children)}
    </Container>
  )
}

PageHeader.propTypes = propTypes
PageHeader.defaultProps = defaultProps

PageHeader.Menu = Menu
PageHeader.Title = PageTitle
PageHeader.Heading = Title

export default withRouter(PageHeader)
