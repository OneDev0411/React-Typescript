import React from 'react'
import { useField } from 'react-final-form'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  MenuItem,
  MenuList,
  Avatar,
  Typography,
  Box,
  Theme,
  TableContainer
} from '@material-ui/core'

import { useTheme } from '@material-ui/styles'

import { BaseDropdown } from 'components/BaseDropdown'

import IconClose from 'components/SvgIcons/Close/CloseIcon'
import type { ISignatureRecipient } from 'deals/Signature/types'
import { getAvatarTitle } from 'deals/utils/get-avatar-title'
import { roleName, getLegalFullName } from 'deals/utils/roles'

import { useIconStyles } from 'views/../styles/use-icon-styles'

export function RecipientsList() {
  const iconClasses = useIconStyles()
  const theme = useTheme<Theme>()

  const { input } = useField('recipients')

  const list = Object.values(input.value || {})

  const handleOrderChange = (recipient: ISignatureRecipient, order: number) => {
    input.onChange({
      ...input.value,
      [recipient.id]: {
        ...recipient,
        order
      }
    })
  }

  const handleChangeType = (
    recipient: ISignatureRecipient,
    type: ISignatureRecipient['envelope_recipient_type']
  ) => {
    input.onChange({
      ...input.value,
      [recipient.id]: {
        ...recipient,
        envelope_recipient_type: type
      }
    })
  }

  const handleRemoveRecipient = (recipient: ISignatureRecipient) => {
    input.onChange(
      list.filter((item: typeof recipient) => item.id !== recipient.id)
    )
  }

  const getRecipientType = (recipient: ISignatureRecipient) => {
    switch (recipient.envelope_recipient_type) {
      case 'CarbonCopy':
        return 'CC'
      case 'Signer':
        return 'Need To Sign'

      default:
        return ''
    }
  }

  return (
    <Box mb={1}>
      {list.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {list.map((recipient: ISignatureRecipient, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{
                      width: '10%'
                    }}
                  >
                    <BaseDropdown
                      buttonLabel={recipient.order}
                      renderMenu={({ close }) => {
                        return (
                          <MenuList>
                            {list.map((_, index) => (
                              <MenuItem
                                key={index}
                                onClick={() => {
                                  close()
                                  handleOrderChange(recipient, index + 1)
                                }}
                              >
                                {index + 1}
                              </MenuItem>
                            ))}
                          </MenuList>
                        )
                      }}
                    />
                  </TableCell>

                  <TableCell
                    style={{
                      width: '55%'
                    }}
                  >
                    <Box display="flex">
                      <Avatar
                        alt={getAvatarTitle(recipient)}
                        src={recipient?.user?.profile_image_url ?? undefined}
                        style={{
                          width: theme.spacing(4),
                          height: theme.spacing(4),
                          marginRight: theme.spacing(1)
                        }}
                      />

                      <div>
                        <Typography variant="body2">
                          {getLegalFullName(recipient)}
                        </Typography>

                        <Typography variant="caption">
                          {roleName(recipient.role)}
                        </Typography>
                      </div>
                    </Box>
                  </TableCell>

                  <TableCell
                    style={{
                      width: '25%'
                    }}
                  >
                    <BaseDropdown
                      buttonLabel={getRecipientType(recipient)}
                      renderMenu={({ close }) => {
                        return (
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                close()
                                handleChangeType(recipient, 'Signer')
                              }}
                            >
                              Need To Sign
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                close()
                                handleChangeType(recipient, 'CarbonCopy')
                              }}
                            >
                              CC
                            </MenuItem>
                          </MenuList>
                        )
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      width: '10%'
                    }}
                  >
                    <IconButton
                      size="medium"
                      onClick={() => handleRemoveRecipient(recipient)}
                    >
                      <IconClose className={iconClasses.small} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
