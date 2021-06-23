import { memo } from 'react'

import { Box, Button, makeStyles } from '@material-ui/core'

import {
  QuestionSection,
  QuestionSectionProps,
  QuestionTitle,
  useSectionContext,
  useWizardContext
} from 'components/QuestionWizard'

import ShowingStepRolePersonCard from './ShowingStepRolePersonCard'

import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'
import { ShowingRoleForm, ShowingRoleFormProps } from '../ShowingRoleForm'

import { ShowingRoleInput } from '../../types'
import { ShowingRoleFormValues } from '../ShowingRoleForm/types'
import ShowingRoleAddNewButton from '../ShowingRoleAddNewButton'
import { getShowingRoleAOrAn, getShowingRoleLabel } from '../../helpers'
import ShowingRoleAutoSubmitAddNewButton from './ShowingRoleAutoSubmitAddNewButton'

const useStyles = makeStyles(
  theme => ({
    formFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: theme.spacing(3)
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(2)
    }
  }),
  { name: 'ShowingStepRolePerson' }
)

interface ShowingStepRolePersonProps
  extends Pick<QuestionSectionProps, 'error'>,
    Pick<ShowingRoleFormProps, 'hasNotificationTypeFields'> {
  role: ShowingRoleInput
  onRoleEdit: (role: ShowingRoleInput) => void
  onRoleAdd: (role: IShowingRoleType, roleId: UUID) => void
  onRoleDelete: (roleId: UUID) => void
}

function ShowingStepRolePerson({
  error,
  role,
  onRoleAdd,
  onRoleEdit,
  onRoleDelete,
  hasNotificationTypeFields
}: ShowingStepRolePersonProps) {
  const classes = useStyles()
  const nextStep = useQuestionWizardSmartNext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const isLastStep = step === wizard.lastVisitedStep

  const handleChange = (values: ShowingRoleFormValues) => {
    onRoleEdit({ ...role, ...values, mode: 'card' })
    nextStep(400)
  }

  const handleRemove = () => {
    onRoleDelete(role.id)
    wizard.setLastVisitedStep(wizard.lastVisitedStep - 1)
    wizard.setCurrentStep(step)
  }

  const handleEdit = () => onRoleEdit({ ...role, mode: 'form' })

  const handleAdd = (roleType: IShowingRoleType) => {
    onRoleAdd(roleType, role.id)
    wizard.setLastVisitedStep(wizard.lastVisitedStep + 1)
    wizard.setCurrentStep(step + 1)
  }

  const showingRoleAOrAn = getShowingRoleAOrAn(role.role).toLowerCase()
  const showingRole = getShowingRoleLabel(role.role).toLowerCase()

  const isForm = role.mode === 'form'

  return (
    <QuestionSection error={error}>
      <QuestionTitle>
        Select {showingRoleAOrAn} {showingRole} and how they should be notified
      </QuestionTitle>
      <SmartQuestionForm
        width={isForm ? '100%' : undefined}
        containerProps={
          isForm ? { maxWidth: 552, marginLeft: 'auto' } : undefined
        }
      >
        {isForm ? (
          <ShowingRoleForm
            hasNotificationTypeFields={hasNotificationTypeFields}
            initialValues={{
              role: role.role,
              first_name: role.first_name,
              last_name: role.last_name,
              email: role.email,
              phone_number: role.phone_number,
              confirm_notification_type: role.confirm_notification_type,
              cancel_notification_type: role.cancel_notification_type,
              user: role.user,
              can_approve: role.can_approve
            }}
            onSubmit={handleChange}
          >
            <div className={classes.formFooter}>
              <Box mr={1} component="span">
                <ShowingRoleAutoSubmitAddNewButton
                  label="Save and Add new participant"
                  onClick={handleAdd}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
              >
                {isLastStep ? 'Next' : 'Save'}
              </Button>
            </div>
          </ShowingRoleForm>
        ) : (
          <>
            <ShowingStepRolePersonCard
              role={role}
              onEdit={handleEdit}
              onRemove={handleRemove}
              deletable={role.deletable}
            />
            <div className={classes.cardFooter}>
              <ShowingRoleAddNewButton
                label="Add new participant"
                onClick={handleAdd}
              />
            </div>
          </>
        )}
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepRolePerson)
