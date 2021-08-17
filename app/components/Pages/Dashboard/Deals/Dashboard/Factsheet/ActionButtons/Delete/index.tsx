import React from 'react'

import { IconButton, useTheme, Theme } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'
import { useSelector } from 'react-redux'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { isRequiredContext } from 'models/Deal/helpers/brand-context/is-required-context'
import { IAppState } from 'reducers'
import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'

interface Props {
  value: unknown
  brandContext: IDealBrandContext
  deal: IDeal
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

export function DeleteButton({ value, brandContext, deal, onClick }: Props) {
  const theme = useTheme<Theme>()

  const brandChecklists = useSelector(({ deals }: IAppState) =>
    getBrandChecklistsById(deals.brandChecklists, deal.brand.id)
  )

  const hasValue = value || value === 0
  const isRequired =
    isRequiredContext(deal, brandChecklists, brandContext.key) && !deal.is_draft

  if (isRequired || !hasValue) {
    return null
  }

  return (
    <IconButton size="small" onClick={onClick}>
      <SvgIcon
        path={mdiTrashCanOutline}
        color={theme.palette.error.main}
        size={muiIconSizes.small}
      />
    </IconButton>
  )
}
