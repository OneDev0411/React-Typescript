import { useState } from 'react'

import { Button, CircularProgress, makeStyles, Theme } from '@material-ui/core'
import { saveAs } from 'file-saver'

import useNotify from '@app/hooks/use-notify'
import { exportDeal } from '@app/models/Deal/export/export-deal'

const useStyles = makeStyles(
  (theme: Theme) => ({
    exportLabel: {
      marginLeft: theme.spacing(1)
    }
  }),
  {
    name: 'DealExport'
  }
)

interface Props {
  deal: IDeal
}

export function ExportDeal({ deal }: Props) {
  const classes = useStyles()
  const notify = useNotify()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const data = await exportDeal(deal)

      saveAs(data, `${deal.title}.zip`)
    } catch (e) {
      notify({
        status: 'error',
        message: 'Export failed. Please try again.'
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      fullWidth
      variant="outlined"
      color="secondary"
      disabled={isExporting}
      onClick={handleExport}
    >
      {isExporting ? (
        <>
          <CircularProgress color="secondary" size={20} />
          <span className={classes.exportLabel}>Preparing Archive</span>
        </>
      ) : (
        'Download Archive'
      )}
    </Button>
  )
}
