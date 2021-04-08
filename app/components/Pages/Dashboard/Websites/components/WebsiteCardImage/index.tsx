import React, { memo, ReactNode } from 'react'
import classNames from 'classnames'

import { Box } from '@material-ui/core'

import useStyles from './styles'

interface WebsiteCardImageProps {
  className?: string
  src: string
  alt: string
  children: ReactNode
}

function WebsiteCardImage({
  className,
  src,
  alt,
  children
}: WebsiteCardImageProps) {
  const classes = useStyles()

  return (
    <Box position="relative" overflow="hidden" zIndex={0}>
      <Box paddingTop="75%" />
      <img
        className={classNames(classes.image, className)}
        src={src}
        alt={alt}
      />
      {children}
    </Box>
  )
}

export default memo(WebsiteCardImage)
