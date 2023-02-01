import { useState } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import { getBrandFontFamilies } from '@app/utils/get-brand-fonts'

import { FontPreview } from './FontPreview'
import { useCanvasTextContext } from './hooks/get-canvas-text-context'
import { useBrand } from './hooks/use-brand'

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
    block: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      fontSize: 20,
      padding: theme.spacing(2),
      '& img': {
        maxWidth: '90%',
        height: theme.spacing(4)
      },
      '&.active': {
        backgroundColor: theme.palette.grey[200]
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
    }
  }),
  {
    name: 'MarketingCenterBlocksCanvasTextFontExplorer'
  }
)

export function FontExplorer() {
  const classes = useStyles()
  const brand = useBrand()
  const { templateOptions, setTextProperty, preview } = useCanvasTextContext()
  const [activeFont, setActiveFont] = useState<Nullable<string>>(null)
  const fonts = [
    ...getBrandFontFamilies(brand!),
    ...(templateOptions?.textEditor?.extraFonts ?? [])
  ]

  const handleSelectFont = (fontName: string) => {
    setActiveFont(fontName)
    setTextProperty('fontFamily', fontName)
    preview()
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {fonts.map(fontName => (
          <div
            key={fontName}
            className={cn(classes.block, {
              active: fontName === activeFont
            })}
            onClick={() => handleSelectFont(fontName)}
          >
            <FontPreview fontName={fontName} />
          </div>
        ))}
      </div>
    </div>
  )
}
