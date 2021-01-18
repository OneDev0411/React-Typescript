import React, { useState } from 'react'
import {
  Box,
  makeStyles,
  TextField,
  Theme,
  Typography,
  Button,
  Avatar
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import { useDebounce, useAsync } from 'react-use'

import { mdiPlus } from '@mdi/js'

import { deleteRole } from 'actions/deals'
import { searchContacts } from 'models/contacts/search-contacts'

import { IAppState } from 'reducers'
import { selectDealRoles } from 'reducers/deals/roles'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import DealRole from 'components/DealRole'

import { RoleCard } from '../../components/RoleCard'

import { useFormContext } from '../../context/use-form-context'
import { convertContactToRole } from '../../../utils/roles'

import type { IDealFormRole } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      maxHeight: '40vh',
      overflow: 'auto',
      '&.has-border': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    },
    row: {
      padding: theme.spacing(1),
      '&:hover': {
        background: theme.palette.action.hover,
        cursor: 'pointer'
      }
    },
    newClientAvatar: {
      border: `1px solid ${theme.palette.secondary.main}`,
      backgroundColor: '#fff'
    },
    newClient: {
      color: theme.palette.secondary.main
    },
    rowContent: {
      paddingLeft: theme.spacing(2)
    },
    email: {
      color: theme.palette.grey[500]
    },
    searchInput: {
      padding: theme.spacing(1.5)
    }
  }),
  {
    name: 'CreateDeal-PrimaryAgent'
  }
)

interface Props {
  step?: number
  title: string
  side: IDealType
}

export function DealClient({ step, side, title }: Props) {
  const classes = useStyles()
  const wizard = useWizardForm()
  const context = useFormContext()
  const dispatch = useDispatch()

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)

  const [contacts, setContacts] = useState<IContact[]>([])

  const [searchCriteria, setSearchCriteria] = useState<string>('')
  const [debouncedSearchCriteria, setDebouncedSearchCriteria] = useState<
    string
  >('')

  useDebounce(
    () => {
      setDebouncedSearchCriteria(searchCriteria)
    },
    700,
    [searchCriteria]
  )

  useAsync(async () => {
    if (searchCriteria.length < 3) {
      return
    }

    const { data: contacts } = await searchContacts(searchCriteria)

    setContacts(contacts)
  }, [debouncedSearchCriteria])

  const allowedRoles = getRoles(context.form.side)

  const roles = useSelector<IAppState, IDealRole[]>(({ deals }) => {
    return context.deal
      ? (selectDealRoles(
          deals.roles,
          context.deal
        ).filter((client: IDealRole) =>
          allowedRoles.includes(client.role)
        ) as IDealRole[])
      : []
  })

  const handleRemoveRole = async (role: IDealRole) => {
    return dispatch(deleteRole(context.deal!.id, role.id))
  }

  const createNewContact = () => {
    const name = debouncedSearchCriteria.split(' ')

    setSelectedRole({
      legal_first_name: name[0],
      legal_last_name: name[1]
    })
  }

  const handleNext = () => {
    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  if (wizard.lastVisitedStep < step!) {
    return null
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>{title}</QuestionTitle>

      {selectedRole ? (
        <Box mt={1}>
          <DealRole
            isOpen
            deal={context.deal}
            user={context.user}
            dealSide={context.form.side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            onClose={() => setSelectedRole(null)}
          />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap">
          {roles.map(client => (
            <RoleCard
              key={client.id}
              role={client}
              onClickEdit={() => setSelectedRole(client)}
              onClickRemove={() => handleRemoveRole(client)}
            />
          ))}
        </Box>
      )}

      <QuestionForm>
        <Box
          className={cn(classes.root, {
            'has-border': contacts.length > 0
          })}
          style={{
            display: !selectedRole ? 'block' : 'none'
          }}
        >
          <TextField
            onChange={e => setSearchCriteria(e.target.value)}
            placeholder="Search name or office"
            size="medium"
            className={classes.searchInput}
            fullWidth
          />

          {debouncedSearchCriteria && (
            <Box
              display="flex"
              alignItems="center"
              className={cn(classes.row, classes.newClient)}
              onClick={createNewContact}
            >
              <Avatar className={classes.newClientAvatar}>
                <SvgIcon path={mdiPlus} className={classes.newClient} />
              </Avatar>

              <div className={classes.rowContent}>
                Add <strong>{searchCriteria}</strong>
              </div>
            </Box>
          )}

          {contacts.map(contact => (
            <Box
              key={contact.id}
              display="flex"
              className={classes.row}
              onClick={() => setSelectedRole(convertContactToRole(contact))}
            >
              <Avatar
                src={contact.profile_image_url!}
                alt={contact.display_name}
              />

              <div className={classes.rowContent}>
                <Typography variant="body2">{contact.display_name}</Typography>

                <Typography variant="body2" className={classes.email}>
                  {contact.email}
                </Typography>
              </div>
            </Box>
          ))}
        </Box>

        {!selectedRole && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={4}
          >
            <Button variant="outlined" onClick={handleNext}>
              Skip
            </Button>

            {roles.length > 0 && (
              <Box ml={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </Box>
            )}
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

function getRoles(type?: IDealType) {
  if (!type) {
    return []
  }

  if (type === 'Buying') {
    return ['Buyer', 'BuyerPowerOfAttorney', 'Tenant', 'TenantPowerOfAttorney']
  }

  if (type === 'Selling') {
    return [
      'Seller',
      'SellerPowerOfAttorney',
      'Landlord',
      'LandlordPowerOfAttorney'
    ]
  }

  return []
}
