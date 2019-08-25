import IconBirthday from 'components/SvgIcons/Birthday/IconBirthday'
import IconGraduation from 'components/SvgIcons/Graduation/IconGraduation'
import IconHome from 'components/SvgIcons/NewHome/IconHome'
import IconHomeAnniversary from 'components/SvgIcons/HomeAnniversary/IconHomeAnniversary'
import IconWork from 'components/SvgIcons/Work/IconWork'
import IconWedding from 'components/SvgIcons/Wedding/IconWedding'
import IconChild from 'components/SvgIcons/Child/IconChild'
import IconPet from 'components/SvgIcons/Pet/IconPet'

export interface ImportantDatesIcon {
  name: string
  color: string
  icon: React.FC<any>
}

export const importantDatesIcons = [
  {
    name: 'Birthday',
    icon: IconBirthday,
    color: '#ff6f6f'
  },
  {
    name: 'graduation anniversary',
    icon: IconGraduation,
    color: '#702283'
  },
  {
    name: 'New Home',
    icon: IconHome,
    color: '#64d9ff'
  },
  {
    name: 'Home Anniversary',
    icon: IconHomeAnniversary,
    color: '#ef3f61'
  },
  {
    name: 'Work Anniversary',
    icon: IconWork,
    color: '#804205'
  },
  {
    name: 'Wedding Anniversary',
    icon: IconWedding,
    color: '#ef3F61'
  },
  {
    name: 'Child birthday',
    icon: IconChild,
    color: '#ffb7b9'
  },
  {
    name: 'Pet',
    icon: IconPet,
    color: '#c57e3e'
  }
].reduce((acc, icon) => {
  return {
    ...acc,
    [icon.name]: icon
  }
}, {}) as Record<string, ImportantDatesIcon>
