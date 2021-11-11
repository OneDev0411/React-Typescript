import { memo } from 'react'

import {
  Grid,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  TextField
} from '@material-ui/core'
import { mdiDeleteOutline } from '@mdi/js'

import { getTemplateMediumLabel } from '@app/utils/marketing-center/get-template-medium-label'
import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { TEMPLATE_TYPES, MEDIUMS } from '../../constants'
import { Asset } from '../../types'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      height: '100%'
    },
    uploadContainer: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1.5, 2, 2),
      height: theme.spacing(7),
      border: `1px dashed ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    image: {
      width: theme.spacing(8),
      height: theme.spacing(14),
      objectFit: 'cover',
      borderRadius: theme.shape.borderRadius
    },
    clickToUpload: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    },
    deleteContainer: {
      flexGrow: 1,
      textAlign: 'right'
    }
  }),
  {
    name: 'MarketingAssetUploadDrawerAssetItem'
  }
)

interface Props {
  asset: Asset
  onUpdateAsset: (asset: Asset) => void
  onDeleteAsset: (asset: Asset) => void
}

export default memo(function AssetItem({
  asset,
  onUpdateAsset,
  onDeleteAsset
}: Props) {
  const classes = useStyles()

  return (
    <Grid
      container
      item
      alignItems="flex-start"
      direction="row"
      key={asset.label}
    >
      <Grid item xs={2}>
        <img
          src={asset.file.url}
          alt={asset.label ?? 'image'}
          className={classes.image}
        />
      </Grid>
      <Grid container item direction="column" xs={9} spacing={4}>
        <Grid item xs>
          <FormControl fullWidth>
            <TextField
              autoFocus
              variant="outlined"
              size="small"
              placeholder="Label"
              value={asset.label}
              onChange={event => {
                onUpdateAsset({
                  ...asset,
                  label: event.target.value
                })
              }}
            />
          </FormControl>
        </Grid>
        <Grid container item direction="row" spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" size="small">
              {/* <InputLabel>Add To</InputLabel> */}
              <Select
                value={asset.templateType}
                onChange={event =>
                  onUpdateAsset({
                    ...asset,
                    templateType: event.target.value as IMarketingTemplateType
                  })
                }
              >
                {TEMPLATE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {getTemplateTypeLabel(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" size="small">
              {/* <InputLabel>Medium</InputLabel> */}
              <Select
                value={asset.medium}
                onChange={event =>
                  onUpdateAsset({
                    ...asset,
                    medium: event.target.value as IMarketingTemplateMedium
                  })
                }
              >
                {MEDIUMS.map(type => (
                  <MenuItem key={type} value={type}>
                    {getTemplateMediumLabel(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.deleteContainer}>
        <IconButton onClick={() => onDeleteAsset(asset)}>
          <SvgIcon size={muiIconSizes.small} path={mdiDeleteOutline} />
        </IconButton>
      </Grid>
    </Grid>
  )
})
