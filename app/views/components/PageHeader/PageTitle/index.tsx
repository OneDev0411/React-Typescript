import React, { ReactNode } from 'react'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'
import { mdiChevronLeft, mdiClose } from '@mdi/js'
import { Theme, makeStyles } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import IconButton from '../../Button/IconButton'

import { TextMiddleTruncate } from '../../TextMiddleTruncate'

import { H1 } from '../../Typography/headings'
import { goTo } from '../../../../utils/go-to'

import { Subtitle } from './Subtitle'

const useStyles = makeStyles(
  (theme: Theme) => ({
    icon: {
      '&:hover': {
        color: theme.palette.primary.main
      }
    }
  }),
  { name: 'PageTitle' }
)

interface Props {
  backUrl?: string
  showBackButton?: boolean
  onClickBackButton?: (event: React.MouseEvent) => void
  onClickCloseButton?: (event: React.MouseEvent) => void
  title?: string
  subtitle?: string
  maxTitleLength?: number
  children?: ReactNode
}

PageTitle.defaultProps = {
  showBackButton: true
}

export function PageTitle(props: Props) {
  const classes = useStyles()
  const { title = '', subtitle, backUrl = '', onClickCloseButton } = props

  function handleOnBack() {
    if (backUrl) {
      return goTo(backUrl)
    }

    const currentLocation = browserHistory.getCurrentLocation()

    if (currentLocation.key) {
      browserHistory.goBack()
    }
  }

  if (typeof onClickCloseButton === 'function') {
    return (
      <Flex justifyBetween style={{ width: '100%' }}>
        <Flex alignCenter>
          {title ? (
            <Flex column>
              <H1 data-type="page-title">{title}</H1>
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
            </Flex>
          ) : (
            props.children
          )}
        </Flex>

        <Flex alignCenter>
          <IconButton iconSize="XLarge" inverse onClick={onClickCloseButton}>
            <SvgIcon
              className={classes.icon}
              path={mdiClose}
              size={muiIconSizes.xlarge}
            />
          </IconButton>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex alignCenter>
      <Flex alignCenter>
        {props.showBackButton && (
          <IconButton
            iconSize="XLarge"
            inverse
            isFit
            onClick={props.onClickBackButton || handleOnBack}
          >
            <SvgIcon
              path={mdiChevronLeft}
              className={classes.icon}
              size={muiIconSizes.large}
            />
          </IconButton>
        )}
        <Flex column>
          {title && (
            <H1 data-type="page-title">
              <TextMiddleTruncate
                text={title}
                maxLength={props.maxTitleLength}
                tooltipPlacement="bottom"
              />
            </H1>
          )}
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Flex>
      </Flex>
      {props.children}
    </Flex>
  )
}
