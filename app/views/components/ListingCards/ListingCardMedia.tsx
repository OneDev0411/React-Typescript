import React, { memo, ReactNode } from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import ListingCardMediaSlider from './ListingCardMediaSlider'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      backgroundColor: theme.palette.grey[100]
    },
    childrenContainer: {
      position: 'absolute',
      zIndex: 2,
      width: '100%',
      top: 0,
      left: 0
    }
  }),
  {
    name: 'ListingCardMedia'
  }
)

interface Props {
  imagesURL: Nullable<string[]>
  children: ReactNode
}

function ListingCardMedia({ children, imagesURL }: Props) {
  const classes = useStyles()

  return (
    <div
      className={classes.container}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.persist()

        const targetElement = e.target as HTMLElement

        if (
          targetElement.classList.contains('swiper-button-next') ||
          targetElement.classList.contains('swiper-button-prev')
        ) {
          e.stopPropagation()
        }
      }}
    >
      <div className={classes.childrenContainer}>{children}</div>
      <ListingCardMediaSlider imagesURL={imagesURL} />
    </div>
  )
}

export default memo(ListingCardMedia)
