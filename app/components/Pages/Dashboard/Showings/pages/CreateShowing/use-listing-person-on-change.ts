import { YesNoAnswer } from '../../components/ShowingStepYesNoQuestion'

function useListingPersonOnChange(
  setYesNoValue: (value: YesNoAnswer) => void,
  setPersonValue: (person: Nullable<IShowingRoleInputPerson>) => void
): (value: YesNoAnswer) => void {
  return (value: YesNoAnswer) => {
    setYesNoValue(value)

    if (value === 'No') {
      setPersonValue(null)
    }
  }
}

export default useListingPersonOnChange
