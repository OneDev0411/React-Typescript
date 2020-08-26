import React from 'react'
import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  Tooltip,
  IconButton
} from '@material-ui/core'
import { mdiProgressUpload, mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BaseFieldProps } from './types'

interface Props extends BaseFieldProps<'image'> {}

export default function ImageField({ variable, onChange }: Props) {
  return (
    <Grid container item>
      <Box width="100%" py={2}>
        <Card variant="outlined">
          <CardActionArea>
            <CardMedia component="img" src={variable.value} />
          </CardActionArea>
        </Card>
        <CardActions>
          <Tooltip title="Change Image">
            <div>
              <IconButton size="small">
                <SvgIcon path={mdiProgressUpload} />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title="Delete Image">
            <div>
              <IconButton size="small">
                <SvgIcon path={mdiTrashCanOutline} />
              </IconButton>
            </div>
          </Tooltip>
        </CardActions>
        {/* <img alt={variable.label} src={variable.value} />
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          label={variable.label}
          value={variable.value ?? ''}
          onChange={e =>
            onChange({
              ...variable,
              value: e.target.value
            })
          }
        /> */}
      </Box>
    </Grid>
  )
}
