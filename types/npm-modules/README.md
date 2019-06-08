For each module that lacks a type definition, we can provide our own 
one here. We can also [fix/augment][1] types of any module that already has
type definitions here.

## Adding type definition for a module
No need to change `typeRoot` or anything in tsconfig. just define an 
ambient module in a `.d.ts` file like this:
```
declare module 'name-of-the-package' {
  export interface Foo {
  }
  export class Bar extends React.Component<BarProps>
}
```

By convention, we name each of this files in the following format:

`[package-name].d.ts`

[1]: http://ideasintosoftware.com/typescript-module-augmentation-vs-declaration/