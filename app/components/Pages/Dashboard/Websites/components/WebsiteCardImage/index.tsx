import { memo, ReactNode } from 'react'

import { Box } from '@material-ui/core'
import classNames from 'classnames'

/*  
  https://gitlab.com/rechat/web/-/issues/5759
  There is an huge performance issue because the Website thumb snapshot that API returns
  is insanely long (sometimes with +76000 px of height) which browsers have trouble rendering.
  the temporary solution is to replace <img> with <canvas> to fix this performance issue.
  TODO: Remove this Canvas Image approach after server fixed the website image size issue
*/
import CanvasImage from '@app/views/components/CanvasImage'

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
      <CanvasImage
        className={classNames(classes.image, className)}
        src={src}
        alt={alt}
      />
      {children}
    </Box>
  )
}

export default memo(WebsiteCardImage)
