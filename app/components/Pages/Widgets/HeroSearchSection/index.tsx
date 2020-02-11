import React from 'react'
import { makeStyles } from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Brand from '../../../../controllers/Brand'
import SearchIcon from '../../../../views/components/SvgIcons/Search/IconSearch'

import MlsSearchAutocomplete from '../MlsSearchAutocomplete'

import { styles } from './styles'

const useStyles = makeStyles(styles, { name: 'HeroSearchSection' })

interface Props {
  brand: IBrand
}

export default function HeroSearchSection({ brand }: Props) {
  const brandSearchBackgroundImage = Brand.asset('search_bg', '', brand)
  const brandSearchHeadline = Brand.message('search_headline', '', brand)
  const isTablet = useMediaQuery('(min-width:480px)')
  const isDesktop = useMediaQuery('(min-width:768px)')
  const classes = useStyles({ brandSearchBackgroundImage, isDesktop, isTablet })

  return (
    <>
      <div className={classes.backgroundCover} />
      <div className={classes.backgroundCoverFilter} />
      <div className={classes.wrapper}>
        {brandSearchHeadline && (
          <h2 className={classes.title}>{brandSearchHeadline}</h2>
        )}
        <MlsSearchAutocomplete id="google_search" brand={brand}>
          <div className={classes.searchBox}>
            <SearchIcon className={classes.searchBox__icon} />
            <input
              type="text"
              className={classes.searchBox__input}
              id="google_search"
              placeholder="Search properties in residential"
            />
          </div>
        </MlsSearchAutocomplete>
      </div>
    </>
  )
}
