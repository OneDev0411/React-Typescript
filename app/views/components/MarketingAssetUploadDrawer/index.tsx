import { useState } from 'react'

import { Button } from '@material-ui/core'
import { FormProvider, useForm } from 'react-hook-form'

import OverlayDrawer from '@app/views/components/OverlayDrawer'
import TeamTreeView from '@app/views/components/TeamTreeView'

import Upload from './components/Upload'
import { DrawerStep, AssetsUploadFormData } from './types'

interface Props {
  defaultSelectedTemplateType?: IMarketingTemplateType
  onClose: () => void
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

  const onSubmit = (data: AssetsUploadFormData) => {
    console.log(data)
  }

  const goToSelectTeamsStep = () => {
    setActiveStep('teams')
  }

  const goToUploadStep = () => {
    setActiveStep('upload')
  }

  const renderActiveStep = () => {
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
          >
            Done
          </Button>
        </OverlayDrawer.Footer>
      )
    }

    return null
  }

  return (
    <OverlayDrawer open onClose={onClose}>
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
