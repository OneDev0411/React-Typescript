import { useState } from 'react'

import { Button } from '@material-ui/core'
import { FormProvider, useForm } from 'react-hook-form'

import { uploadBrandAsset } from '@app/models/brand/upload-asset'
import OverlayDrawer from '@app/views/components/OverlayDrawer'
import TeamTreeView from '@app/views/components/TeamTreeView'

import Upload from './components/Upload'
import { DrawerStep, AssetsUploadFormData } from './types'

interface Props {
  defaultSelectedTemplateType?: IMarketingTemplateType
  onClose: (uploadedAssets?: IBrandAsset[]) => void
}

export default function MarketingAssetUploadDrawer({
  defaultSelectedTemplateType,
  onClose
}: Props) {
  const [activeStep, setActiveStep] = useState<DrawerStep>('teams')
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const formMethods = useForm<AssetsUploadFormData>({
    defaultValues: {
      assets: []
    },
    shouldUnregister: false
  })
  const assets = formMethods.watch('assets')
  const brand = formMethods.watch('brand')

  const onSubmit = async (data: AssetsUploadFormData) => {
    setUploadProgress(data.assets.map(() => 0))

    const uploadedAssets = await Promise.all(
      data.assets.map((asset, index) => {
        return uploadBrandAsset(
          [data.brand.id],
          asset.file.object,
          {
            label: asset.label,
            template_type: asset.templateType,
            medium: asset.medium
          },
          progressEvent => {
            if (
              progressEvent.direction !== 'upload' ||
              !progressEvent.percent
            ) {
              return
            }

            setUploadProgress(uploadProgress => {
              return [
                ...uploadProgress.slice(0, index),
                progressEvent.percent!,
                ...uploadProgress.slice(index + 1)
              ]
            })
          }
        )
      })
    )

    setUploadProgress([])

    onClose(uploadedAssets)
  }

  const goToSelectTeamsStep = () => {
    setActiveStep('teams')
  }

  const goToUploadStep = () => {
    setActiveStep('upload')
  }

  const isUploadingFiles = uploadProgress.length > 0

  const closeDrawer = () => {
    if (isUploadingFiles) {
      return
    }

    onClose()
  }

  const renderActiveStep = () => {
    if (activeStep === 'teams') {
      return (
        <TeamTreeView
          onSelectTeam={brand => formMethods.setValue('brand', brand)}
        />
      )
    }

    if (activeStep === 'upload') {
      return (
        <Upload
          uploadProgress={uploadProgress}
          defaultSelectedTemplateType={defaultSelectedTemplateType}
        />
      )
    }

    return null
  }

  const renderActions = () => {
    if (activeStep === 'teams') {
      return (
        <OverlayDrawer.Footer rowReverse>
          <Button
            variant="contained"
            color="primary"
            disabled={!brand}
            onClick={goToUploadStep}
          >
            Next: Select Files
          </Button>
        </OverlayDrawer.Footer>
      )
    }

    if (activeStep === 'upload') {
      return (
        <OverlayDrawer.Footer>
          <Button variant="outlined" onClick={goToSelectTeamsStep}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={formMethods.handleSubmit(data => onSubmit(data))}
            disabled={
              formMethods.formState.isSubmitting ||
              assets.length === 0 ||
              isUploadingFiles
            }
          >
            Upload Files
          </Button>
        </OverlayDrawer.Footer>
      )
    }

    return null
  }

  const title = activeStep === 'teams' ? 'Select Teams' : 'Upload Files'

  return (
    <OverlayDrawer open onClose={closeDrawer}>
      <OverlayDrawer.Header title={title} />
      <OverlayDrawer.Body>
        <FormProvider {...formMethods}>
          <form
            style={{ height: '100%', overflow: 'hidden' }}
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            {renderActiveStep()}
          </form>
        </FormProvider>
      </OverlayDrawer.Body>
      {renderActions()}
    </OverlayDrawer>
  )
}
