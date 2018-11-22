import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import Flex from 'styled-flex-component'

import copyToClipboard from 'utils/copy-text-to-clipboard'
import Loading from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'

import LinkButton from 'components/Button/LinkButton'

import { SectionTitle } from '../styled'
import { LinkContainer, LinkAddress } from './styled'

function ShareLink(props) {
  const handleCopyLink = () => {
    copyToClipboard(props.instance.file.url)

    props.notify({
      message: 'Link Copied',
      status: 'success'
    })
  }

  return (
    <Fragment>
      <SectionTitle>Share via direct URL</SectionTitle>
      <LinkContainer>
        <LinkAddress onClick={handleCopyLink}>
          {props.fileUrl || (
            <Flex
              alignCenter
              style={{
                color: '#003bdf',
                fontSize: '0.875rem'
              }}
            >
              Creating Link
              <Loading
                style={{
                  marginLeft: '0.5rem',
                  width: '3rem',
                  paddingTop: '3px'
                }}
              />
            </Flex>
          )}
        </LinkAddress>

        {props.instance !== null && (
          <div>
            <LinkButton
              style={{ padding: 0, margin: 0, fontWeight: 500 }}
              onClick={handleCopyLink}
            >
              Copy
            </LinkButton>
          </div>
        )}
      </LinkContainer>
    </Fragment>
  )
}

export default connect(
  null,
  { notify }
)(ShareLink)
