import IconBirthday from 'components/SvgIcons/Birthday/IconBirthday'
import IconGraduation from 'components/SvgIcons/Graduation/IconGraduation'
import IconHome from 'components/SvgIcons/NewHome/IconHome'
import IconHomeAnniversary from 'components/SvgIcons/HomeAnniversary/IconHomeAnniversary'
import IconWork from 'components/SvgIcons/Work/IconWork'
import IconWedding from 'components/SvgIcons/Wedding/IconWedding'
import IconChild from 'components/SvgIcons/Child/IconChild'
import IconPet from 'components/SvgIcons/Pet/IconPet'

interface Icon {
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
    name: 'GraduationAnniversary',
    icon: IconGraduation,
    color: '#702283'
  },
  {
    name: 'NewHome',
    icon: IconHome,
    color: '#64d9ff'
  },
  {
    name: 'HomeAnniversary',
    icon: IconHomeAnniversary,
    color: '#ef3f61'
  },
  {
    name: 'WorkAnniversary',
    icon: IconWork,
    color: '#804205'
  },
  {
    name: 'WeddingAnniversary',
    icon: IconWedding,
    color: '#ef3F61'
  },
  {
    name: 'ChildBirthday',
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
}, {}) as Record<string, Icon>
