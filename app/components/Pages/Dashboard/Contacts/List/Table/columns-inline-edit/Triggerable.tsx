import { useCallback, useState, useMemo } from 'react'

import { makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import {
  TRIGGERABLE_ATTRIBUTES,
  TRIGGERING_TIME
} from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/constants'
import { EditMode } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/EditMode'
import {
  validation as validationAttrFields,
  getPlaceholder,
  getStateFromTrigger,
  getInitialErrorMessage,
  validateTriggerFields,
  getValue,
  parseValue
} from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/helpers'
import { TriggerEditMode } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/TriggerEditMode'
import { getContactTriggers } from '@app/components/Pages/Dashboard/Contacts/Profile/components/SectionWithFields/helpers/get-contact-triggers'
import useConfirmation from '@app/hooks/use-confirmation'
import useNotify from '@app/hooks/use-notify'
import { excludeContactFromGlobalTrigger } from '@app/models/instant-marketing/global-triggers'
import {
  createTrigger,
  updateTrigger,
  removeTrigger
} from '@app/models/instant-marketing/triggers'
import { createTemplateInstance } from '@app/models/instant-marketing/triggers/helpers'
import { TriggerDataInput } from '@app/models/instant-marketing/triggers/types'
import { IAppState } from '@app/reducers'
import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import { noop } from '@app/utils/helpers'
import { EditMode as TriggerEditor } from '@app/views/components/inline-editable-fields/InlineEditableField/EditMode'
import { deleteAttribute } from 'models/contacts/delete-attribute'
import { getContact } from 'models/contacts/get-contact'
import { updateContactQuery } from 'models/contacts/helpers/default-query'
import { selectGlobalTriggersAttributes } from 'selectors/globalTriggers'

import { generateEmptyAttribute } from '../../../Profile/components/SectionWithFields'
import { TriggerableInlineEditLoading } from '../components/TriggerableInlineEditLoading'

import { useAttributeCell } from './AttributeCell/hooks/use-attribute-cell'
import { InlineEditColumnsProps } from './type'

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(1, 1)
    },
    error: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1)
    },
    save: {
      marginTop: theme.spacing(1.5)
    }
  }),
  {
    name: 'TriggerableInlineEdit'
  }
)

interface Props extends InlineEditColumnsProps {
  attributeName: TriggerContactEventTypes
}

type ContactAttribute = IContactAttributeWithDef & { cuid?: UUID }

export function TriggerableInlineEdit({
  attributeName,
  contact,
  callback = noop,
  close = noop
}: Props) {
  const classes = useStyles()

  const notify = useNotify()
  const confirmation = useConfirmation()

  const user = useSelector((state: IAppState) => selectUser(state))
  const brand = useSelector((state: IAppState) => selectActiveBrand(state))

  const attributeGlobalTrigger = useSelector((state: IAppState) => {
    return selectGlobalTriggersAttributes(state)[attributeName] || null
  })

  const updateContact = useCallback(() => {
    callback(contact.id)
  }, [callback, contact.id])

  const { create, update, attributeDef } = useAttributeCell(
    contact,
    attributeName,
    updateContact
  )

  const [triggerContact, setTriggerContact] =
    useState<Nullable<ITriggeredContact>>(null)
  const [attribute, setAttribute] = useState<Nullable<ContactAttribute>>(null)
  const [trigger, setTrigger] = useState<Nullable<ITrigger>>(null)
  const [isTriggerActive, setIsTriggerActive] = useState<boolean>(false)
  const [triggerSender, setTriggerSender] = useState<Nullable<IUser>>(null)
  const [triggerSubject, setTriggerSubject] = useState<string>('')
  const [triggerSendBefore, setTriggerSendBefore] = useState<number>(0)
  const [triggerSelectedTemplate, setTriggerSelectedTemplate] =
    useState<Nullable<IMarketingTemplateInstance | IBrandMarketingTemplate>>(
      null
    )
  const [error, setError] = useState<string>('')
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [isTriggerFieldDirty, setIsTriggerFieldDirty] = useState<boolean>(false)
  const [isTriggerSaving, setIsTriggerSaving] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)

  const [fieldLabel, setFieldLabel] = useState<Nullable<string>>(null)
  const [fieldValue, setFieldValue] = useState<Nullable<number | string>>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const placeholder = useMemo(() => {
    return getPlaceholder(attributeDef)
  }, [attributeDef])

  const isTriggerable = useMemo(() => {
    return (
      TRIGGERABLE_ATTRIBUTES.includes(attributeName) && !attribute?.is_partner
    )
  }, [attribute?.is_partner, attributeName])

  const setInitialStates = useCallback(
    (
      triggerContact: ITriggeredContact,
      attribute: ContactAttribute,
      trigger: ITrigger,
      attributeGlobalTrigger: Nullable<
        IGlobalTrigger<'template' | 'template_instance'>
      >
    ) => {
      try {
        setTriggerContact(triggerContact)
        setAttribute(attribute)
        setFieldLabel(attribute.label || null)
        setFieldValue(getValue(attribute))
        setTrigger(trigger)
        setTriggerContact(triggerContact)
        setError(getInitialErrorMessage(triggerContact, isTriggerable))

        const triggerState = getStateFromTrigger(
          trigger,
          attributeGlobalTrigger,
          triggerContact,
          attribute
        )

        setIsTriggerActive(triggerState.isTriggerActive)
        setTriggerSender(triggerState.triggerSender)
        setTriggerSubject(triggerState.triggerSubject)
        setTriggerSendBefore(triggerState.triggerSendBefore)
        setTriggerSelectedTemplate(triggerState.triggerSelectedTemplate)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    },
    [isTriggerable]
  )

  const fetchContact = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await getContact(contact.id, {
        associations: [
          ...updateContactQuery.associations,
          'contact.triggers',
          'trigger.campaign',
          'email_campaign.from',
          'email_campaign.template',
          'template_instance.template'
        ]
      })

      const triggerContact = response.data as ITriggeredContact
      const attr =
        triggerContact.attributes?.find(attr => {
          return attr.attribute_type === attributeName
        }) ||
        (generateEmptyAttribute(
          attributeDef,
          false,
          ''
        ) as unknown as ContactAttribute) // Because the original helper is not TS
      const triggers = getContactTriggers(triggerContact)
      const trigger = triggers[attributeName]

      setInitialStates(triggerContact, attr, trigger, attributeGlobalTrigger)
    } catch (error) {
      console.log(error)
    }
  }, [
    contact.id,
    attributeDef,
    attributeName,
    setInitialStates,
    attributeGlobalTrigger
  ])

  const handleSaveAttribute = () => {
    if (!attribute || !attributeDef) {
      return
    }

    const payload = {
      label: fieldLabel === '' ? null : fieldLabel,
      is_partner: attribute.is_partner,
      [attributeDef.data_type]: parseValue(fieldValue, attributeDef)
    }

    // we should create the attribute if it's not exist
    if (!attribute.id) {
      create({ id: attribute.cuid, ...payload })

      return
    }

    // Remove the attribute if there's no data_type
    if (payload[attributeDef.data_type] === '') {
      // API doesn't like empty string https://gitlab.com/rechat/web/issues/2932
      removeAttribute()

      return
    }

    // Otherwise, Update the attribute
    update(attribute.id, payload)
  }

  const handleValidationBeforeSave = async () => {
    if (!isDirty) {
      const error = attribute?.id ? 'Update value!' : 'Change something!'

      return error
    }

    const error = await validationAttrFields(attributeDef, fieldValue)

    if (error) {
      return error
    }

    // Validate Trigger Field
    const shouldCheckTriggerField = isTriggerable && isTriggerFieldDirty

    if (shouldCheckTriggerField) {
      const error = validateTriggerFields(
        {
          template: triggerSelectedTemplate,
          wait_for: triggerSendBefore,
          subject: triggerSubject,
          event_type: attributeName
        },
        trigger
      )

      if (error) {
        return error
      }
    }

    return null
  }

  const handleSaveTrigger = async () => {
    const shouldCheckTriggerField = isTriggerable && isTriggerFieldDirty

    if (!shouldCheckTriggerField) {
      return
    }

    if (!isTriggerActive) {
      setIsTriggerSaving(true)

      if (trigger) {
        await removeTrigger(trigger.id)
      }

      if (attributeGlobalTrigger) {
        await excludeContactFromGlobalTrigger(
          contact.id,
          attributeName,
          brand?.id
        )
      }

      return
    }

    /*
    since we can create a trigger from global trigger data and
    they also accept brand templates we should check the type of template
    to make sure it's a template instance and if not create an instance from it
    because we just need a template instance for contact trigger.
    */

    setIsTriggerSaving(true)

    if (!triggerSelectedTemplate || !triggerSender) {
      return
    }

    const template =
      triggerSelectedTemplate?.type === 'template_instance'
        ? triggerSelectedTemplate
        : await createTemplateInstance(triggerSelectedTemplate, brand, {
            user
          })
    const userContact = {
      ...contact,
      user
    }

    const triggerData: TriggerDataInput = {
      recurring: true,
      time: TRIGGERING_TIME, // it's hard coded base api team comment
      sender: triggerSender,
      subject: triggerSubject,
      wait_for: triggerSendBefore,
      event_type: attributeName
    }

    if (trigger) {
      await updateTrigger(trigger, userContact, template, triggerData)

      return
    }

    await createTrigger(userContact, template, triggerData)
  }

  const save = async () => {
    const error = await handleValidationBeforeSave()

    if (error) {
      return setError(error)
    }

    try {
      setIsSaving(true)
      setIsTriggerSaving(false)
      setDisabled(true)
      setError('')
      setDisabled(false)
      setIsDirty(false)
      await handleSaveTrigger()
      handleSaveAttribute()
      close()
    } catch (error) {
      console.error(error)
      setDisabled(false)
      setError(error.message)
    } finally {
      setIsTriggerSaving(false)
      setIsSaving(false)
    }
  }

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      save()
    }
  }

  const onChangeValue = (value: Nullable<string | number>) => {
    setFieldValue(value)
    setIsDirty(true)
  }

  const onChangeLabel = (value: Nullable<string>) => {
    setFieldLabel(value)
    setIsDirty(true)
  }

  const onChangeTriggerActive = (value: boolean) => {
    setIsDirty(true)
    setIsTriggerFieldDirty(true)
    setIsTriggerActive(value)
  }

  const onChangeSubject = (value: string) => {
    setIsDirty(true)
    setIsTriggerFieldDirty(true)
    setTriggerSubject(value)
  }

  const onChangeSender = (value: IUser) => {
    setIsDirty(true)
    setIsTriggerFieldDirty(true)
    setTriggerSender(value)
  }

  const onChangeSendBefore = (value: number) => {
    setIsDirty(true)
    setIsTriggerFieldDirty(true)
    setTriggerSendBefore(value)
  }

  const onChangeTemplate = (templateInstance: IMarketingTemplateInstance) => {
    setIsDirty(true)
    setIsTriggerFieldDirty(true)
    setTriggerSelectedTemplate(templateInstance)
  }

  const cancel = () => {
    return close()
  }

  const removeAttribute = async () => {
    try {
      await deleteAttribute(contact.id, attribute?.id)

      notify({
        status: 'success',
        message: `${attributeDef?.label || attributeDef?.name} deleted.`
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAll = async () => {
    try {
      if (trigger) {
        await removeTrigger(trigger.id)
      }

      await removeAttribute()
      setDisabled(false)
      callback(contact.id)

      return close()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = () => {
    setDisabled(true)

    const title = attributeDef?.label
    const options = {
      confirmLabel: 'Yes, I do',
      message: `Delete ${title}`,
      onConfirm: deleteAll,
      onCancel: () => setDisabled(false),
      description: `You have made changes, are you sure about deleting "${title}" field?`
    }

    if (isDirty) {
      confirmation.setConfirmationModal(options || {})
    } else {
      deleteAll()
    }
  }

  useEffectOnce(() => {
    fetchContact()
  })

  const renderEditMode = () => {
    if (!attribute || !triggerSender) {
      return null
    }

    const baseEditMode = (
      <EditMode
        error={error}
        attribute={attribute}
        onEnterKeyPress={onEnterKeyPress}
        onChangeValue={onChangeValue}
        onChangeLabel={onChangeLabel}
        placeholder={placeholder}
      />
    )

    return (
      <TriggerEditMode
        renderAttributeFields={() => baseEditMode}
        attributeName={attributeName}
        attributeGlobalTrigger={attributeGlobalTrigger}
        isActive={isTriggerActive}
        isSaving={isTriggerSaving}
        subject={triggerSubject}
        sender={triggerSender}
        sendBefore={triggerSendBefore}
        selectedTemplate={triggerSelectedTemplate}
        onChangeActive={onChangeTriggerActive}
        onChangeSubject={onChangeSubject}
        onChangeSender={onChangeSender}
        onChangeSendBefore={onChangeSendBefore}
        onChangeTemplate={onChangeTemplate}
        disabled={!triggerContact?.email}
      />
    )
  }

  return (
    <div className={classes.container}>
      {!isLoading ? (
        <TriggerEditor
          isStatic
          showDelete
          error={error}
          isSaving={isSaving}
          isEditing
          handleCancel={cancel}
          handleDelete={handleDelete}
          handleSave={save}
          isDisabled={disabled || !isDirty}
          isPopoverMode={false}
          render={renderEditMode}
          popoverContainerRef={null}
          isTransparent
        />
      ) : (
        <TriggerableInlineEditLoading hasAlert={!attributeGlobalTrigger} />
      )}
    </div>
  )
}
