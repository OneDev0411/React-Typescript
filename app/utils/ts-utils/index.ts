import { StyledComponent } from 'styled-components'
import { ClassKeyOfStyles, ClassNameMap } from '@material-ui/styles/withStyles'


export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}


export type ClassesProps<S> = {
  classes?: Partial<ClassNameMap<ClassKeyOfStyles<S>>>
}

export type StyledSVGWithProps<T> = StyledComponent<
  'svg',
  any,
  Partial<{
    size: any
    sizes: any
    fillColor: any
    fillColorRule: any
    noStyles: any
  }> & T,
  never
>
