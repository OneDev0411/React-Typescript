import { useState, useMemo, useContext } from 'react'

import { Button } from '@material-ui/core'
import pluralize from 'pluralize'
import { FormProvider, useForm } from 'react-hook-form'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import useNotify from '@app/hooks/use-notify'
import { uploadBrandAsset } from '@app/models/brand/upload-asset'
import { BaseMultiSelectDrawer } from '@app/views/components/BrandSelector'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'
import OverlayDrawer from '@app/views/components/OverlayDrawer'

import Upload from './components/Upload'
import { DrawerStep, AssetsUploadFormData } from './types'

interface Props {
  defaultSelectedTemplateType?: IMarketingTemplateType
  defaultSelectedMedium?: IMarketingTemplateMedium
  onClose: (uploadedAssets?: IBrandAsset[]) => void
}

export default function MarketingAssetUploadDrawer({
  defaultSelectedTemplateType,
  defaultSelectedMedium,
  onClose
}: Props) {
  const confirmation = useContext(ConfirmationModalContext)
  const notify = useNotify()
  const activeBrandId = useActiveBrandId()
  const [activeStep, setActiveStep] = useState<DrawerStep>('teams')
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const formMethods = useForm<AssetsUploadFormData>({
    defaultValues: {
      assets: [],
      brands: []
    },
    shouldUnregister: false
  })
  const brands = formMethods.watch('brands')
  const assets = formMethods.watch('assets')

  const handleUploadAssets = async (data: AssetsUploadFormData) => {
    setUploadProgress(data.assets.map(() => 0))

    try {
      const uploadedAssets = await Promise.all(
        data.assets.map(async (asset, index) => {
          const newUploadedAssets = await uploadBrandAsset(
            data.brands,
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

          return newUploadedAssets[0]
        })
      )

      onClose(uploadedAssets)
    } catch (error) {
      console.error(error)
      notify({
        status: 'error',
        message:
          'Something went wrong while uploading your assets. Please try again.'
      })
    }

    setUploadProgress([])
  }

  const onSubmit = (data: AssetsUploadFormData): Promise<void> => {
    return new Promise(resolve => {
      confirmation.setConfirmationModal({
        message: `You are going to add ${pluralize(
          'asset',
          data.assets.length,
          true
        )} to ${pluralize('team', data.brands.length, true)}. Are you sure?`,
        confirmLabel: 'Yes, I am sure',
        onCancel: resolve,
        onConfirm: async () => {
          await handleUploadAssets(data)
          resolve()
        }
      })
    })
  }

  const goToSelectTeamsStep = () => {
    setActiveStep('teams')
  }

  const goToUploadStep = () => {
    setActiveStep('upload')
  }

  const isValid = useMemo(() => {
    if (assets.length === 0) {
      return false
    }

    return assets.every(asset => asset.templateType && asset.medium)
  }, [assets])

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
        <BaseMultiSelectDrawer
          open
          drawerTitle="Save to Marketing Center for:"
          saveButtonText="Next: Select Files"
          selectedBrands={brands}
          onClose={closeDrawer}
          brandSelectorProps={{
            rootBrandId: activeBrandId
          }}
          onSave={brands => {
            formMethods.setValue('brands', brands)

            setActiveStep('upload')

            return Promise.resolve()
          }}
        />
      )
    }

    if (activeStep === 'upload') {
      return (
        <Upload
          uploadProgress={uploadProgress}
          defaultSelectedTemplateType={defaultSelectedTemplateType}
          defaultSelectedMedium={defaultSelectedMedium}
        />
      )
    }

    return null
  }

  const isWorking = formMethods.formState.isSubmitting || isUploadingFiles

  const renderActions = () => {
    if (activeStep === 'teams') {
      return (
        <OverlayDrawer.Footer rowReverse>
          <Button
            variant="contained"
            color="primary"
            disabled={brands.length === 0}
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
          <Button
            disabled={isWorking}
            variant="outlined"
            onClick={goToSelectTeamsStep}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isWorking || !isValid}
            onClick={formMethods.handleSubmit(data => onSubmit(data))}
          >
            Upload Files
          </Button>
        </OverlayDrawer.Footer>
      )
    }

    return null
  }

  const title = activeStep === 'teams' ? 'Select Agents' : 'Upload Files'

  return (
    <OverlayDrawer open onClose={closeDrawer}>
      <OverlayDrawer.Header title={title} />
      <OverlayDrawer.Body>
        <FormProvider {...formMethods}>
          <form
            style={{ height: '100%' }}
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
