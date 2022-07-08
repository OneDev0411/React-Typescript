import { useState, ChangeEvent, FormEvent } from 'react'

import { mdiSendOutline } from '@mdi/js'
import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import useNotify from '@app/hooks/use-notify'
import { shareBrandAsset } from '@app/models/brand/share-brand-asset'
import { shareInstance } from '@app/models/instant-marketing/instance-share'
import {
  selectUserDisplayName,
  selectUserFormattedPhoneNumber
} from '@app/selectors/user'
import { isValidPhoneNumber } from '@app/utils/helpers'
import {
  MaskedInput,
  PHONE_NUMBER_MASK
} from '@app/views/components/MaskedInput'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import SocialDrawerAction from './SocialDrawerAction'

interface SocialDrawerSendSMSProps {
  className?: string
  instance: IMarketingTemplateInstance | IBrandAsset
}

function SocialDrawerSendSMS({
  className,
  instance
}: SocialDrawerSendSMSProps) {
  const notify = useNotify()
  const phoneNumber = useSelector(selectUserFormattedPhoneNumber)
  const displayName = useSelector(selectUserDisplayName)

  const [isSending, setIsSending] = useState<boolean>(false)
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false)

  useEffectOnce(() => {
    async function initValidPhoneValue() {
      if (phoneNumber) {
        setIsValidPhone(await isValidPhoneNumber(phoneNumber))
      }
    }

    initValidPhoneValue()
  })

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
      if (instance.type === 'template_instance') {
        await shareInstance(
          instance.id,
          [phone],
          `${displayName} sent you this image! Tap on the link and press share on Instagram, Facebook, or LinkedIn.`
        )
      }

      if (instance.type === 'brand_asset') {
        await shareBrandAsset(
          instance.brand,
          instance.id,
          [phone],
          `${displayName} sent you this file! Tap on the link and press share on Instagram, Facebook, or LinkedIn.`
        )
      }

      notify({
        message: `${
          instance.type === 'brand_asset' ? 'Asset' : 'Image'
        } link sent to the phone number.`,
        status: 'success'
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <SocialDrawerAction
        textFieldProps={{
          helperText:
            'Send image to yourself and post it directly from your phone',
          placeholder: 'Add phone number',
          label: 'SMS:',
          name: 'phone',
          onChange: handleChange,
          defaultValue: phoneNumber || '',
          inputProps: {
            mask: PHONE_NUMBER_MASK
          },
          InputProps: {
            inputComponent: MaskedInput
          }
        }}
        buttonProps={{
          children: isSending ? 'Sending...' : 'Send',
          startIcon: (
            <SvgIcon path={mdiSendOutline} size={muiIconSizes.small} />
          ),
          type: 'submit',
          disabled: isSending || isValidPhone === false
        }}
      />
    </form>
  )
}

export default SocialDrawerSendSMS
