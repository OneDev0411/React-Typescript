import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Menu from './Menu'
import PageTitle from './PageTitle'

const Container = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`

const propTypes = {
  backUrl: PropTypes.string,
  backButton: PropTypes.bool,
  title: PropTypes.string.isRequired
}

const defaultProps = {
  backButton: true
}

function PageHeader({ title, backButton, backUrl, children }) {
  return (
    <Container>
      <PageTitle backButton={backButton} title={title} backUrl={backUrl} />
      {children}
    </Container>
  )
}

PageHeader.propTypes = propTypes
PageHeader.defaultProps = defaultProps

PageHeader.Menu = Menu

export default PageHeader
