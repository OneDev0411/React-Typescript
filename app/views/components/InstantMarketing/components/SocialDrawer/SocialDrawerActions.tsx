import { Grid, Divider, makeStyles } from '@material-ui/core'

import { getFileType } from 'utils/file-utils/get-file-type'

import SocialDrawerCopyLink from './SocialDrawerCopyLink'
import SocialDrawerDownloadButton from './SocialDrawerDownloadButton'
import SocialDrawerInstagramButton from './SocialDrawerInstagramButton'
import SocialDrawerSendSMS from './SocialDrawerSendSMS'

const useStyles = makeStyles(
  theme => ({
    row: { margin: theme.spacing(4, 0) },
    action: { marginBottom: theme.spacing(4) }
  }),
  { name: 'SocialDrawerActions' }
)

interface SocialDrawerActionsProps {
  instance: IMarketingTemplateInstance | IBrandAsset
}

function SocialDrawerActions({ instance }: SocialDrawerActionsProps) {
  const classes = useStyles()

  const isPDFType =
    instance.type === 'template_instance' &&
    getFileType(instance.file) === 'pdf'

  return (
    <>
      <div className={classes.row}>
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <SocialDrawerInstagramButton
              onClick={() => console.log('Go for scheduling the post')}
            />
          </Grid>
          <Grid item sm={6}>
            <SocialDrawerDownloadButton instance={instance} />
          </Grid>
        </Grid>
      </div>
      <Divider />
      <div className={classes.row}>
        {!isPDFType && (
          <SocialDrawerSendSMS className={classes.action} instance={instance} />
        )}
        <SocialDrawerCopyLink className={classes.action} instance={instance} />
      </div>
    </>
  )
}

export default SocialDrawerActions
