import React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'

import useMediaQuery from '@material-ui/core/useMediaQuery'

import Brand from '../../../../controllers/Brand'
import SearchIcon from '../../../../views/components/SvgIcons/Search/IconSearch'

import MlsSearchAutocomplete from '../MlsSearchAutocomplete'

interface StylesProps {
  isTablet: boolean
  isDesktop: boolean
  brandSearchBackgroundImage: string
}

const useStyles = makeStyles(
  () =>
    createStyles({
      searchBox__input: (props: StylesProps) => {
        const initialStyles = {
          width: 'calc(100% - 2rem)',
          height: '100%',
          padding: '0.5rem 0.7rem',
          fontSize: '0.8rem',
          border: 'none',
          borderRadius: '4px',

          '&:focus': {
            outline: 'none'
          }
        }

        if (props.isDesktop) {
          return {
            ...initialStyles,
            width: 'calc(100% - 2.5rem)',
            padding: '0.5rem 1rem',
            fontSize: '1.1rem'
          }
        }

        return initialStyles
      },
      backgroundCover: (props: StylesProps) => ({
        backgroundColor: '#cecece',
        backgroundImage: `url(${props.brandSearchBackgroundImage})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 0
      }),
      backgroundCoverFilter: {
        backgroundColor: '#000',
        height: '100%',
        width: '100%',
        position: 'absolute',
        opacity: 0.5,
        zIndex: 1
      },
      title: {
        color: '#fff'
      },
      wrapper: (props: StylesProps) => {
        if (props.isDesktop) {
          return {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '550px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            zIndex: 2
          }
        }

        if (props.isTablet) {
          return {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            zIndex: 2
          }
        }

        return {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '230px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 2
        }
      },
      searchBox: {
        width: '100%',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '4px',
        backgroundColor: '#fff'
      },
      searchBox__icon: {
        marginLeft: '1rem',
        width: '1.5rem !important',
        height: '1.5rem !important',
        opacity: 0.3
      }
    }),
  { name: 'HeroSearchSection' }
)

interface Props {
  brand: IBrand
}

export default function HeroSearchSection({ brand }: Props) {
  const brandSearchBackgroundImage = Brand.asset('search_bg', '', brand)
  const brandSearchHeadline = Brand.message('search_headline', '', brand)
  const isDesktop = useMediaQuery('(min-width:768px)')
  const isTablet = useMediaQuery('(min-width:480px)')
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
