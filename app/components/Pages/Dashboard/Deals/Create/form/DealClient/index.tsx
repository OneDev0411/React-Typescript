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
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { useDebounce, useAsync } from 'react-use'

import { mdiPlus } from '@mdi/js'

import { deleteRole } from 'actions/deals'
import { searchContacts } from 'models/contacts/search-contacts'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import DealRole from 'components/DealRole'

import { RoleCard } from '../../components/RoleCard'

import { useCreationContext } from '../../context/use-creation-context'
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
  title: string
  side: IDealType
  roles: IDealRole[]
  onChange: (role: IDealRole, type: 'update' | 'create' | 'delete') => void
}

export function DealClient({ side, title, roles, onChange }: Props) {
  const classes = useStyles()

  const { deal, user, checklist } = useCreationContext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const dispatch = useDispatch()

  const allowedRoles = getRoles(side)
  const clientRoles = roles.filter(client => allowedRoles.includes(client.role))

  /**
   * list of all existence roles
   */

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)

  const [contacts, setContacts] = useState<IContact[]>([])

  const [searchCriteria, setSearchCriteria] = useState<string>('')
  const [debouncedSearchCriteria, setDebouncedSearchCriteria] = useState<
    string
  >('')

  /**
   * debounce search criteria to don't search contacts on input change
   */
  useDebounce(
    () => {
      setDebouncedSearchCriteria(searchCriteria)
    },
    700,
    [searchCriteria]
  )

  /**
   * Search for contacts when the search criteria changes
   */
  useAsync(async () => {
    if (searchCriteria.length < 3) {
      return
    }

    const { data: contacts } = await searchContacts(searchCriteria)

    setContacts(contacts)
  }, [debouncedSearchCriteria])

  /**
   * Starts creating a new contact based on the given name
   */
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

  const handleUpsertRole = (role: IDealRole, type: 'create' | 'update') => {
    if (role.deal) {
      return
    }

    onChange?.(role, type)
  }

  const handleDeleteRole = (role: IDealRole) => {
    if (role.deal) {
      dispatch(deleteRole(deal!.id, role.id))

      return
    }

    onChange?.(role, 'delete')
  }

  if (wizard.lastVisitedStep < step) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>{title}</QuestionTitle>

      {selectedRole ? (
        <Box mt={1}>
          <DealRole
            isOpen
            user={user}
            deal={deal}
            checklist={checklist}
            dealSide={side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            onUpsertRole={handleUpsertRole}
            onDeleteRole={handleDeleteRole}
            onClose={() => setSelectedRole(null)}
          />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap">
          {clientRoles.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              /* readonly prop only is valid in Create Offer flow
               * and makes readonly the roles that have been already created
               */
              readonly={!deal && !!role.deal}
              onClickEdit={() => setSelectedRole(role)}
              onClickRemove={() => handleDeleteRole(role)}
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
            fullWidth
            onChange={e => setSearchCriteria(e.target.value)}
            placeholder="Search name or office"
            size="medium"
            className={classes.searchInput}
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

            {clientRoles.length > 0 && (
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
