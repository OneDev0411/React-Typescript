import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import cn from 'classnames'
import { Filters } from 'pikaso'

import { useImageEditor } from '../../../hooks/use-image-editor'
import { FILTERS } from '../../../hooks/use-image-filters'
import { FilterType, ImageFilter } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      maxWidth: '100%',
      overflow: 'auto'
    },
    imageFilter: {
      width: 'auto',
      height: theme.spacing(10),
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      '&.active': {
        border: `1px solid ${theme.palette.primary.main}`
      },
      '&:hover': {
        cursor: 'pointer'
      }
    },
    skeleton: {
      width: theme.spacing(8),
      height: theme.spacing(10),
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(1)
    },
    caption: {
      color: theme.palette.grey[500]
    }
  }),
  {
    name: 'ImageEditorFilterActions'
  }
)

interface Props {
  filters: Partial<Record<keyof FilterType[], ImageFilter>>
}

export function FilterMenu({ filters }: Props) {
  const classes = useStyles()
  const { editor, activeFilter, setActiveFilter } = useImageEditor()

  const applyFilter = async (filter: Filters | null = null) => {
    if (!editor) {
      return
    }

    setActiveFilter(filter)

    if (activeFilter) {
      editor.board.background.image.removeFilter(activeFilter)
    }

    if (filter) {
      editor.board.background.image.addFilter(filter)
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      className={classes.root}
    >
      {FILTERS.map(filter => (
        <>
          {filters[filter.name] ? (
            <div key={filter.name}>
              <img
                src={filters[filter.name]}
                alt={filter.name}
                className={cn(classes.imageFilter, {
                  active:
                    (activeFilter as Nullable<{ name: string }>)?.name ===
                    filter.name
                })}
                onClick={() => applyFilter(filter.js)}
              />

              <Box textAlign="center">
                <Typography variant="caption" className={classes.caption}>
                  {filter.name}
                </Typography>
              </Box>
            </div>
          ) : (
            <Skeleton variant="rect" className={classes.skeleton} />
          )}
        </>
      ))}
    </Box>
  )
}
