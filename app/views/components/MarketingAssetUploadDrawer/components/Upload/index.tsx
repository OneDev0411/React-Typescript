import { useCallback } from 'react'

import { Grid, Box, Typography, makeStyles } from '@material-ui/core'
import { mdiImageMultipleOutline } from '@mdi/js'
import { useDropzone, FileRejection } from 'dropzone'
import pluralize from 'pluralize'
import { useFormContext, Controller } from 'react-hook-form'

import useNotify from '@app/hooks/use-notify'
import { readFileAsDataUrl } from '@app/utils/file-utils/read-file-as-data-url'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { Asset, AssetsUploadFormData } from '../../types'
import AssetItem from '../AssetItem'
import ZeroState from '../ZeroState'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      height: '100%'
    },
    uploadContainer: {
      position: 'static',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      padding: theme.spacing(1.5, 2, 2),
      height: theme.spacing(7),
      border: `1px dashed ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    clickToUpload: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    }
  }),
  {
    name: 'MarketingAssetUploadDrawerUpload'
  }
)

interface Props {
  defaultSelectedTemplateType?: IMarketingTemplateType
  defaultSelectedMedium?: IMarketingTemplateMedium
  uploadProgress: number[]
}

export default function Upload({
  defaultSelectedTemplateType,
  defaultSelectedMedium,
  uploadProgress
}: Props) {
  const classes = useStyles()
  const notify = useNotify()
  const { setValue, watch, formState, control } =
    useFormContext<AssetsUploadFormData>()

  const assets = watch('assets')

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejections: FileRejection[]) => {
      // All files are invalid
      if (acceptedFiles.length === 0 && rejections.length > 0) {
        notify({
          status: 'error',
          message: 'Only images, mp4 videos, and PDFs are allowed.'
        })

        return
      }

      // Some files are invalid
      if (rejections.length > 0) {
        notify({
          status: 'warning',
          message: `${pluralize(
            'file',
            rejections.length,
            true
          )} rejected. Only images, mp4 videos, and PDFs are allowed.`
        })
      }

      const preSelectedTemplateType =
        assets.length > 0
          ? assets[assets.length - 1].templateType ??
            defaultSelectedTemplateType
          : defaultSelectedTemplateType

      const preSelectedMedium =
        assets.length > 0
          ? assets[assets.length - 1].medium ?? defaultSelectedMedium
          : defaultSelectedMedium

      const newAssets: Asset[] = [
        ...assets,
        ...(await Promise.all(
          acceptedFiles.map(async file => ({
            label: '',
            templateType: preSelectedTemplateType,
            medium: preSelectedMedium,
            file: {
              object: file,
              url: await readFileAsDataUrl(file)
            }
          }))
        ))
      ]

      setValue('assets', newAssets)
    },
    [
      setValue,
      assets,
      notify,
      defaultSelectedTemplateType,
      defaultSelectedMedium
    ]
  )

  const handleUpdateAsset = useCallback(
    (updatedAsset: Asset) => {
      const assetIndex = assets.findIndex(
        asset => asset.file.url === updatedAsset.file.url
      )
      const oldAsset = assets[assetIndex]
      const newAsset = {
        ...oldAsset,
        ...updatedAsset
      }

      setValue('assets', [
        ...assets.slice(0, assetIndex),
        newAsset,
        ...assets.slice(assetIndex + 1)
      ])
    },
    [assets, setValue]
  )

  const handleDeleteAsset = useCallback(
    (asset: Asset) => {
      setValue(
        'assets',
        assets.filter(item => item.file.url !== asset.file.url)
      )
    },
    [assets, setValue]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    accept: ['image/*', 'video/mp4', 'application/pdf']
  })

  if (assets.length === 0) {
    return <ZeroState onUpload={onDrop} />
  }

  return (
    <div className={classes.wrapper} {...getRootProps()}>
      {!formState.isSubmitting && (
        <>
          <input {...getInputProps()} />
          <Grid
            container
            direction="row"
            alignItems="center"
            className={classes.uploadContainer}
          >
            <Grid item>
              <Box mr={1} pt={0.5}>
                <SvgIcon
                  path={mdiImageMultipleOutline}
                  size={muiIconSizes.small}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary" onClick={open}>
                {isDragActive ? (
                  'Drop your files to upload'
                ) : (
                  <>
                    Drag more files here or{' '}
                    <span className={classes.clickToUpload}>
                      click to upload
                    </span>
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <Grid container direction="column" spacing={4}>
        <Controller
          control={control}
          name="assets"
          render={({ value }: { value: Asset[] }) => (
            <>
              {value.map((asset, index) => {
                const currentItemUploadProgress = uploadProgress
                  ? uploadProgress[index]
                  : undefined

                return (
                  <AssetItem
                    uploadProgress={currentItemUploadProgress}
                    key={asset.file.url}
                    asset={asset}
                    onDeleteAsset={handleDeleteAsset}
                    onUpdateAsset={handleUpdateAsset}
                  />
                )
              })}
            </>
          )}
        />
      </Grid>
    </div>
  )
}
