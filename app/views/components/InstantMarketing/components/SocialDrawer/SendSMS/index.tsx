import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import {
  selectUserDisplayName,
  selectUserFormattedPhoneNumber
} from 'selectors/user'

import { isValidPhoneNumber } from 'utils/helpers'

import { addNotification as notify } from 'components/notification'
import { shareInstance } from 'models/instant-marketing/instance-share'

import { Section } from '../components/Section'

interface SendSMSProps {
  instance: IMarketingTemplateInstance
}

function SendSMS({ instance }: SendSMSProps) {
  const phoneNumber = useSelector(selectUserFormattedPhoneNumber)
  const displayName = useSelector(selectUserDisplayName)
  const dispatch = useDispatch()
  const [isSending, setIsSending] = useState(false)
  const [isValidPhone, setIsValidPhone] = useState(false)

  useEffectOnce(() => {
    async function initValidPhoneValue() {
      if (phoneNumber) {
        setIsValidPhone(await isValidPhoneNumber(phoneNumber))
      }
    }

    initValidPhoneValue()
  })

  const handleChangePhone = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsValidPhone(await isValidPhoneNumber(e.target.value))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const phoneInput = e.currentTarget.elements.namedItem(
      'phone'
    ) as HTMLInputElement
    const phone = phoneInput.value

    setIsSending(true)

    try {
      await shareInstance(
        instance.id,
        [phone],
        `${displayName} sent you this image! Tap on the link and press share on Instagram, Facebook, or LinkedIn.`
      )

      dispatch(
        notify({
          message: 'Image link sent to the phone number.',
          status: 'success'
        })
      )
    } catch (e) {
      console.error(e)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Section
        title="Send via SMS:"
        buttonCaption={isSending ? 'Sending...' : 'Send'}
        buttonProps={{
          type: 'submit',
          disabled: isSending || isValidPhone === false
        }}
        description="Send image to yourself and post it directly from your phone."
        styles={{
          info: {
            padding: 0
          }
        }}
      >
        <input
          name="phone"
          onChange={handleChangePhone}
          placeholder="Add phone number"
          defaultValue={phoneNumber || ''}
        />
      </Section>
    </form>
  )
}

export default SendSMS
