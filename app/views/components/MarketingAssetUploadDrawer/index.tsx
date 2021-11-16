import { useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { FormProvider, useForm } from 'react-hook-form'

import { uploadBrandAsset } from '@app/models/brand/upload-asset'
import LoadingContainer from '@app/views/components/LoadingContainer'
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
  const [activeStep, setActiveStep] = useState<DrawerStep>('upload')
  const formMethods = useForm<AssetsUploadFormData>({
    defaultValues: {
      assets: []
    },
    shouldUnregister: false
  })
  const assets = formMethods.watch('assets')
  const brand = formMethods.watch('brand')

  const onSubmit = async (data: AssetsUploadFormData) => {
    const uploadedAssets = await Promise.all(
      data.assets.map(asset => {
        return uploadBrandAsset([data.brand.id], asset.file.object, {
          label: asset.label,
          template_type: asset.templateType,
          medium: asset.medium
        })
      })
    )

    onClose(uploadedAssets)
  }

  const goToSelectTeamsStep = () => {
    setActiveStep('teams')
  }

  const goToUploadStep = () => {
    setActiveStep('upload')
  }

  const renderActiveStep = () => {
    if (formMethods.formState.isSubmitting) {
      return (
        <Box mt={4}>
          <LoadingContainer noPaddings />
        </Box>
      )
    }

    if (activeStep === 'upload') {
      return (
        <Upload defaultSelectedTemplateType={defaultSelectedTemplateType} />
      )
    }

    if (activeStep === 'teams') {
      return (
        <TeamTreeView
          onSelectTeam={brand => formMethods.setValue('brand', brand)}
        />
      )
    }

    return null
  }

  const renderActions = () => {
    if (activeStep === 'upload') {
      return (
        <OverlayDrawer.Footer rowReverse>
          <Button
            variant="contained"
            color="primary"
            disabled={assets.length === 0}
            onClick={goToSelectTeamsStep}
          >
            Next: Select Teams
          </Button>
        </OverlayDrawer.Footer>
      )
    }

    if (activeStep === 'teams') {
      return (
        <OverlayDrawer.Footer>
          <Button variant="outlined" onClick={goToUploadStep}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={formMethods.handleSubmit(data => onSubmit(data))}
            disabled={formMethods.formState.isSubmitting || !brand}
          >
            Done
          </Button>
        </OverlayDrawer.Footer>
      )
    }

    return null
  }

  return (
    <OverlayDrawer open onClose={() => onClose()}>
      <OverlayDrawer.Header title="Add to Marketing Center" />
      <OverlayDrawer.Body>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            {renderActiveStep()}
          </form>
        </FormProvider>
      </OverlayDrawer.Body>
      {renderActions()}
    </OverlayDrawer>
  )
}
