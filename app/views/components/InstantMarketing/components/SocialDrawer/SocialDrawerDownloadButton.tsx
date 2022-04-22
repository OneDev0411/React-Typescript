import { useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiArrowDown } from '@mdi/js'
import FileSaver from 'file-saver'
import agent from 'superagent'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getFilenameFromURL } from './helpers'

interface SocialDrawerDownloadButtonProps {
  instance: IMarketingTemplateInstance | IBrandAsset
}

function SocialDrawerDownloadButton({
  instance
}: SocialDrawerDownloadButtonProps) {
  const [isWorking, setIsWorking] = useState(false)

  const handleDownload = async () => {
    setIsWorking(true)

    const data = await agent
      .get(`/api/utils/cors/${btoa(instance.file.url)}`)
      .responseType('blob')

    FileSaver.saveAs(data.body, getFilenameFromURL(instance.file.url))

    setIsWorking(false)
  }

  return (
    <Button
      disabled={isWorking}
      onClick={handleDownload}
      variant="outlined"
      fullWidth
      startIcon={<SvgIcon path={mdiArrowDown} size={muiIconSizes.small} />}
    >
      {isWorking ? 'Working...' : 'Download'}
    </Button>
  )
}

export default SocialDrawerDownloadButton
