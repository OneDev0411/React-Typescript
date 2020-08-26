import { TemplateVariable, TemplateVariableType } from '../../types'

export interface BaseFieldProps<T extends TemplateVariableType> {
  variable: TemplateVariable<T>
  onChange: (variable: TemplateVariable<T>) => void
}
