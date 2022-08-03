import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import cn from 'classnames'

import { useImageFilters, Filters, Filter } from '@app/hooks/use-image-filters'

import { useImageEditor } from '../../../hooks/use-image-editor'

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
  file: File | string
}

export function FilterMenu({ file }: Props) {
  const classes = useStyles()
  const { editor, activeFilter, setActiveFilter } = useImageEditor()
  const [filters] = useImageFilters(file)

  const applyFilter = async (filter: Filter) => {
    if (!editor) {
      return
    }

    if (activeFilter) {
      editor.board.background.image.removeFilter(
        editor.board.background.image.filters
      )
    }

    if (filter?.customFn) {
      editor.board.background.image.addFilter({
        customFn: filter?.customFn
      })
    }

    setActiveFilter(filter)
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      className={classes.root}
    >
      {Filters.map(({ name, label }) => (
        <>
          {filters[name] ? (
            <div key={name}>
              <img
                src={filters[name].imageData}
                alt={name}
                className={cn(classes.imageFilter, {
                  active:
                    (activeFilter as Nullable<{ name: string }>)?.name === name
                })}
                onClick={() => applyFilter(filters[name])}
              />

              <Box textAlign="center">
                <Typography variant="caption" className={classes.caption}>
                  {label}
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
