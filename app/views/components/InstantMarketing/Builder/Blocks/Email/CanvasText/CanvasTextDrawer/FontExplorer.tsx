import { useEffect, useMemo, useState } from 'react'

import {
  Box,
  Button,
  InputAdornment,
  makeStyles,
  TextField,
  Theme
} from '@material-ui/core'
import { mdiMagnify } from '@mdi/js'
// import { Font } from '@samuelmeuli/font-manager'
import cn from 'classnames'
// import FontFaceObserver from 'fontfaceobserver'
import matchSorter from 'match-sorter'

// import { useFonts } from '@app/hooks/use-fonts'
import { getBrandFontFamilies } from '@app/utils/get-brand-fonts'
import { SvgIcon } from '@app/views/components/SvgIcons'

// import { DefaultCanvasTextProperties } from './constants'
import { useCanvasTextContext } from './hooks/get-canvas-text-context'
import { useBrand } from './hooks/use-brand'

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
    activeFont: {
      display: 'block',
      width: '100%',
      textAlign: 'center',
      fontSize: 25,
      color: theme.palette.info.main
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
  const { templateOptions, getTextProperty, setTextProperty, preview } =
    useCanvasTextContext()

  const brand = useBrand()

  const [activeFont, setActiveFont] = useState<Nullable<string>>(null)
  const [displayCount, setDisplayCount] = useState(LIMIT)
  const [searchCriteria, setSearchCriteria] = useState('')

  const fonts = useMemo(
    () => [
      ...getBrandFontFamilies(brand!),
      ...(templateOptions?.textEditor?.extraFonts ?? [])
    ],
    [brand, templateOptions?.textEditor?.extraFonts]
  )

  const list = useMemo(() => {
    const filteredList =
      searchCriteria.length > 1 ? matchSorter(fonts, searchCriteria) : fonts

    return filteredList.slice(0, displayCount)
  }, [displayCount, searchCriteria, fonts])

  const handleShowMore = () => {
    setDisplayCount(count =>
      count + LIMIT < fonts.length ? count + LIMIT : fonts.length
    )
  }

  const handleSelectFont = (font: string) => {
    setActiveFont(font)
    setTextProperty('fontFamily', font)
    preview()
    // new FontFaceObserver(font, {
    //   style: getTextProperty<string>('fontStyle')
    // })
    //   .load()
    //   .then(() => {
    //     setTextProperty('fontFamily', font)
    //     preview()
    //   })
    //   .catch((e: ErrorEvent) => {
    //     console.log(e)
    //   })
  }

  const isShowMoreVisible = () => {
    if (searchCriteria && list.length < displayCount) {
      return false
    }

    if (displayCount >= fonts.length) {
      return false
    }

    return true
  }

  /**
   * When creating canvas data from json, select the active font
   */
  useEffect(() => {
    // const currentLabelFont =
    //   getTextProperty<string>('fontFamily') ??
    //   DefaultCanvasTextProperties.text.fontFamily!
    // if (
    //   fonts.size > 0 &&
    //   activeFont === null &&
    //   currentLabelFont !== DefaultCanvasTextProperties.text.fontFamily
    // ) {
    //   setActiveFont(fonts.get(currentLabelFont) ?? null)
    // }
  }, [fonts, activeFont, getTextProperty])

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

      {activeFont && (
        <Box mb={2}>
          <div
            className={classes.activeFont}
            style={{
              fontFamily: activeFont.family
            }}
          >
            {activeFont.family}
          </div>
        </Box>
      )}

      <div className={classes.container}>
        {list.map(fontName => (
          <div
            key={fontName}
            className={cn(classes.block, {
              active: activeFont === fontName
            })}
            style={{
              fontFamily: fontName
            }}
            onClick={() => handleSelectFont(fontName)}
          >
            {fontName}
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
