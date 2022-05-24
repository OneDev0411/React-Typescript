export interface Manifest {
  name: string
  version: string
  build: string
  inputs: string[]
  size: 'lg' | 'md' | 'sm' | 'xl' | 'xs'
}
