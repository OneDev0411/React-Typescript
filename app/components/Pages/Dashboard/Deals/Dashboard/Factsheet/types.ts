export interface ContextField extends IDealBrandContext {
  approved: boolean
  mandatory: boolean
  getFormattedValue(value: unknown): string
  validate(field: IDealBrandContext, value: unknown): boolean
}
