import { useEffect, useState, useRef } from 'react'

import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import cn from 'classnames'

import { useImageFilters, Filters } from '@app/hooks/use-image-filters'

const useStyles = makeStyles(
  (theme: Theme) => ({
    skeleton: {
      width: '140px',
      height: '120px',
      borderRadius: theme.shape.borderRadius
    },
    hidden: {
      display: 'none'
    },
    thumbnail: {
      width: 'auto',
      height: '100px',
      borderRadius: theme.shape.borderRadius,
      border: '2px solid transparent',
      '&:hover': {
        cursor: 'pointer',
        opacity: 0.8
      },
      '&.selected': {
        border: `2px solid ${theme.palette.primary.main}`
      }
    },
    thumbnailContainer: {
      marginRight: theme.spacing(1),
      textAlign: 'center'
    }
  }),
  {
    name: 'ImageQuickFilters'
  }
)

interface Props {
  isOpen: boolean
  image: string
  onSelect: (image: string) => void
}

export function PresetFilters({ isOpen, image, onSelect }: Props) {
  const classes = useStyles()
  const editorRef = useRef<Nullable<HTMLDivElement>>(null)

  const [selectedFilter, setSelectedFilter] = useState<Nullable<string>>(null)

  const [filters, resetFilters] = useImageFilters(image, 1)

  const handleSelect = (filter: string) => {
    setSelectedFilter(filter)
    onSelect(filters[filter].imageData)
  }

  useEffect(() => {
    if (isOpen) {
      return
    }

    resetFilters()
  }, [isOpen, resetFilters])

  return (
    <Box display="flex" width="100%" overflow="auto" pb={2} pt={5}>
      <div ref={editorRef} className={classes.hidden} />
      {Filters.map(({ name, label }) => {
        return (
          <div key={name} className={classes.thumbnailContainer}>
            {filters[name] ? (
              <Box>
                <div>
                  <img
                    alt=""
                    src={filters[name].imageData}
                    className={cn(classes.thumbnail, {
                      selected: selectedFilter === name
                    })}
                    onClick={() => handleSelect(name)}
                  />

                  <Box textAlign="center">
                    <Typography variant="caption">{label}</Typography>
                  </Box>
                </div>
              </Box>
            ) : (
              <Skeleton variant="rect" className={classes.skeleton} />
            )}
          </div>
        )
      })}
    </Box>
  )
}
