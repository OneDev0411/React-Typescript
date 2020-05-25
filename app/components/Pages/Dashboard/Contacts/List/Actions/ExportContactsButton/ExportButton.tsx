import React from 'react'
import { List, useTheme } from '@material-ui/core'
import { mdiAt, mdiProgressDownload, mdiEmailOutline } from '@mdi/js'

import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Item } from './Item'
import { DownloadType, ExportType } from './types'

interface Props {
  disabled: boolean
  onExportClick: (exportType: ExportType) => Promise<void>
}

export function ExportButton({ disabled, onExportClick }: Props) {
  const theme = useTheme()
  const iconColor = theme.palette.common.black

  const items: DownloadType[] = [
    {
      title: 'Export For Mailers',
      description:
        'Use this for print campaigns, like importing into XpressDocs',
      type: ExportType.Mailer,
      icon: <SvgIcon path={mdiEmailOutline} color={iconColor} />
    },
    {
      title: 'Export For Email',
      description: 'Use this for email campaigns, like importing into Rezora',
      type: ExportType.Email,
      icon: <SvgIcon path={mdiAt} color={iconColor} />
    },
    {
      title: 'Full Export',
      description: 'Download everything, all your contact fields',
      type: ExportType.Full,
      icon: <SvgIcon path={mdiProgressDownload} color={iconColor} />
    }
  ]

  const onClickItem = async (exportType: ExportType, onClose: () => void) => {
    onExportClick(exportType)
    onClose()
  }

  return (
    <BaseDropdown
      buttonLabel="Export"
      DropdownToggleButtonProps={{ disabled, variant: 'outlined' }}
      renderMenu={({ close }) => (
        <List>
          {items.map(item => (
            <Item
              key={item.type}
              icon={item.icon}
              title={item.title}
              onClick={() => onClickItem(item.type, close)}
              description={item.description}
            />
          ))}
        </List>
      )}
    />
  )
}
