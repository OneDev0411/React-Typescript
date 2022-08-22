import { useEffect, useState } from 'react'

import { Button, Fade, makeStyles, Slide, Theme } from '@material-ui/core'
import cn from 'classnames'

import { ImageFilters } from './ImageFilters'
import { PresetFilters } from './PresetFilters'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '200px',
      backgroundColor: '#fff',
      zIndex: 2,
      padding: theme.spacing(1)
    },
    overlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      backgroundColor: theme.palette.action.disabledBackground,
      zIndex: 1
    },
    menu: {
      position: 'absolute',
      top: 10,
      right: 10
    }
  }),
  {
    name: 'ImageQuickFilters'
  }
)

interface Props {
  image: string
  isOpen: boolean
  onUpdate?: (image: string) => void
  onClose: (image: Nullable<string>) => void
}

export function ImageQuickFilters({ isOpen, image, onUpdate, onClose }: Props) {
  const classes = useStyles()
  const [activeMenu, setActiveMenu] = useState<'preset' | 'custom'>('custom')
  const [result, setResult] = useState<Nullable<string>>(null)

  useEffect(() => {
    if (isOpen) {
      return
    }

    setActiveMenu('custom')
  }, [isOpen])

  const handleSetResult = (imageData: string) => {
    setResult(imageData)
    onUpdate?.(imageData)
  }

  return (
    <div>
      <Fade in={isOpen} mountOnEnter unmountOnExit>
        <div className={classes.overlay} onClick={() => onClose(result)} />
      </Fade>

      <Slide in={isOpen} direction="up" mountOnEnter unmountOnExit>
        <div className={cn(classes.root, 'u-scrollbar--thinner')}>
          {activeMenu === 'preset' && (
            <PresetFilters
              isOpen={isOpen}
              image={image}
              onSelect={handleSetResult}
            />
          )}
          {activeMenu === 'custom' && (
            <ImageFilters
              isOpen={isOpen}
              image={image}
              onChange={handleSetResult}
            />
          )}

          <div className={classes.menu}>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                setActiveMenu(menu => (menu === 'custom' ? 'preset' : 'custom'))
              }
            >
              {activeMenu === 'preset'
                ? 'Show Advanced Options'
                : 'Show Preset Filters'}
            </Button>
          </div>
        </div>
      </Slide>
    </div>
  )
}
