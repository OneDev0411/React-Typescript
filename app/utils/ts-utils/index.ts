import { ClassKeyOfStyles, ClassNameMap } from '@material-ui/styles/withStyles'

export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}

export function notNull<T>(x: T | null): x is T {
  return x !== null
}

export type ClassesProps<S> = {
  classes?: Partial<ClassNameMap<ClassKeyOfStyles<S>>>
}
