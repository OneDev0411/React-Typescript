import { memo, ReactNode } from 'react'

import { Box } from '@material-ui/core'
import classNames from 'classnames'

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
  children,
  alt
}: WebsiteCardImageProps) {
  const classes = useStyles()

  return (
    <Box position="relative" overflow="hidden" zIndex={0}>
      <Box paddingTop="75%" />
      <img
        src={src}
        alt={alt}
        className={classNames(classes.image, className)}
      />
      {children}
    </Box>
  )
}

export default memo(WebsiteCardImage)
