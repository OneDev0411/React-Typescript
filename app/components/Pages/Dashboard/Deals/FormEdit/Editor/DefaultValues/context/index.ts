import { createContext } from 'react'

// TODO: define types of the entire forms project
interface Context {
  annotation: Nullable<IFormAnnotation>
  annotationType: Nullable<number>
  setAnnotation: (
    annotation: Nullable<IFormAnnotation>,
    type?: Nullable<number>
  ) => void
}

export const DefaultValuesContext = createContext<Context>({
  annotation: null,
  annotationType: null,
  setAnnotation: annotation => {}
})
