import { useMemo, useState } from 'react'

import {
  Button,
  InputAdornment,
  makeStyles,
  TextField,
  Theme
} from '@material-ui/core'
import { mdiMagnify } from '@mdi/js'
import { Font } from '@samuelmeuli/font-manager'
import cn from 'classnames'
import FontFaceObserver from 'fontfaceobserver'
import matchSorter from 'match-sorter'

import { useFonts } from '@app/hooks/use-fonts'
import { SvgIcon } from '@app/views/components/SvgIcons'

import { useCanvasTextContext } from './hooks/get-canvas-text-context'

const LIMIT = 30

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      margin: theme.spacing(2, 0)
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing(2)
    },
    showMore: {
      margin: theme.spacing(2, 0)
    },
    block: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      fontSize: 20,
      padding: theme.spacing(2),
      '&.active': {
        color: theme.palette.secondary.main
      },
      '&:hover': {
        backgroundColor: theme.palette.grey['100'],
        cursor: 'pointer'
      }
    },
    searchBar: {
      position: 'sticky',
      top: 0,
      backgroundColor: '#fff',
      padding: theme.spacing(2, 0)
    },
    searchBarTextFieldIcon: {
      color: theme.palette.grey['400']
    }
  }),
  {
    name: 'MarketingCenterBlocksCanvasTextFontExplorer'
  }
)

export function FontExplorer() {
  const classes = useStyles()
  const { preview, setTextProperty } = useCanvasTextContext()

  const [fonts] = useFonts({
    limit: 300,
    categories: ['handwriting', 'display', 'serif', 'monospace'],
    sort: 'popularity',
    scripts: ['latin', 'latin-ext']
  })
  const [activeFont, setActiveFont] = useState<Nullable<Font>>(null)
  const [displayCount, setDisplayCount] = useState(LIMIT)
  const [searchCriteria, setSearchCriteria] = useState('')

  const list = useMemo(() => {
    const list = Object.values(Object.fromEntries(fonts))

    const filteredList =
      searchCriteria.length > 1
        ? matchSorter(list, searchCriteria, {
            keys: ['family', 'kind']
          })
        : list

    return filteredList.slice(0, displayCount)
  }, [fonts, displayCount, searchCriteria])

  const handleShowMore = () => {
    setDisplayCount(count =>
      count + LIMIT < fonts.size ? count + LIMIT : fonts.size
    )
  }

  const handleSelectFont = (font: Font) => {
    setActiveFont(font)

    new FontFaceObserver(font.family)
      .load()
      .then(() => {
        setTextProperty('fontFamily', font.family)
        preview()
      })
      .catch((e: ErrorEvent) => {
        console.log(e)
      })
  }

  const isShowMoreVisible = () => {
    if (searchCriteria && list.length < displayCount) {
      return false
    }

    if (displayCount >= fonts.size) {
      return false
    }

    return true
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchBar}>
        <TextField
          placeholder="Search font name"
          color="secondary"
          size="small"
          fullWidth
          value={searchCriteria}
          onChange={e => {
            setSearchCriteria(e.target.value)
            setDisplayCount(LIMIT)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon
                  path={mdiMagnify}
                  className={classes.searchBarTextFieldIcon}
                />
              </InputAdornment>
            )
          }}
        />
      </div>

      <div className={classes.container}>
        {list.map(font => (
          <div
            key={font.id}
            className={cn(classes.block, {
              active: activeFont?.id === font.id
            })}
            style={{
              fontFamily: font.family
            }}
            onClick={() => handleSelectFont(font)}
          >
            {font.family}
          </div>
        ))}
      </div>

      {isShowMoreVisible() && (
        <Button
          variant="text"
          color="secondary"
          size="large"
          className={classes.showMore}
          fullWidth
          onClick={handleShowMore}
        >
          Show More Fonts...
        </Button>
      )}
    </div>
  )
}
