import React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'

import Brand from '../../../../controllers/Brand'
import SearchIcon from '../../../../views/components/SvgIcons/Search/IconSearch'

import MlsSearchAutocomplete from '../MlsSearchAutocomplete'

const useStyles = makeStyles(
  () =>
    createStyles({
      backgroundCover: ({
        brandSearchBackgroundImage
      }: {
        brandSearchBackgroundImage: string
      }) => ({
        backgroundColor: '#cecece',
        backgroundImage: `url(${brandSearchBackgroundImage})`,
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
      wrapper: {
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
      },
      searchBox__input: {
        width: 'calc(100% - 2.5rem)',
        height: '100%',
        padding: '0.5rem 1rem',
        fontSize: '1.1rem',
        border: 'none',
        borderRadius: '4px',

        '&:focus': {
          outline: 'none'
        }
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
  const classes = useStyles({ brandSearchBackgroundImage })

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
