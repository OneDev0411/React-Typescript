import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Menu from './Menu'
import { PageTitle, Heading } from './PageTitle'

const Container = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
  background-color: ${props => (props.isFlat ? 'transparent' : '#fff')};
  box-shadow: ${props =>
    props.isFlat
      ? 'none'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
`

const propTypes = {
  backButton: PropTypes.bool,
  isFlat: PropTypes.bool,
  title: PropTypes.string
}

const defaultProps = {
  backButton: true,
  isFlat: true
}

function PageHeader({ title, backButton, children, isFlat }) {
  return (
    <Container isFlat={isFlat}>
      {title && <PageTitle backButton={backButton} title={title} />}
      {React.Children.map(children, children => children)}
    </Container>
  )
}

PageHeader.propTypes = propTypes
PageHeader.defaultProps = defaultProps

PageHeader.Menu = Menu
PageHeader.Title = PageTitle
PageHeader.Heading = Heading

export default PageHeader
