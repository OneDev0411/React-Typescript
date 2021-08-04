import { useRef } from 'react'

import { useDebouncedCallback } from 'use-debounce/lib'

import ShowingRoleAddNewButton, {
  ShowingRoleAddNewButtonProps
} from '../ShowingRoleAddNewButton'

type ShowingRoleAutoSubmitAddNewButtonProps = ShowingRoleAddNewButtonProps

function ShowingRoleAutoSubmitAddNewButton({
  onClick,
  ...otherProps
}: ShowingRoleAutoSubmitAddNewButtonProps) {
  const submitRef = useRef<HTMLButtonElement>(null)

  const [submit] = useDebouncedCallback(() => submitRef.current?.click(), 500)

  const handleClick = (role: IShowingRoleType) => {
    onClick?.(role)
    submit()
  }

  return (
    <>
      <ShowingRoleAddNewButton {...otherProps} onClick={handleClick} />
      <button ref={submitRef} type="submit" hidden>
        submit
      </button>
    </>
  )
}

export default ShowingRoleAutoSubmitAddNewButton
