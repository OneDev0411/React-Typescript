import IconBirthday from '../../components/SvgIcons/Birthday/IconBirthday'
import IconGraduation from '../../components/SvgIcons/Graduation/IconGraduation'
import IconHome from '../../components/SvgIcons/NewHome/IconHome'
import IconHomeAnniversary from '../../components/SvgIcons/HomeAnniversary/IconHomeAnniversary'
import IconWork from '../../components/SvgIcons/Work/IconWork'
import IconWedding from '../../components/SvgIcons/Wedding/IconWedding'
import IconChild from '../../components/SvgIcons/Child/IconChild'
import IconPet from '../../components/SvgIcons/Pet/IconPet'

function getIcons() {
  const icons = {}
  const iconsArray = [
    {
      name: 'Birthday',
      icon: IconBirthday,
      color: '#FF6F6F'
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
      color: '#EF3F61'
    },
    {
      name: 'Work Anniversary',
      icon: IconWork,
      color: '#804205'
    },
    {
      name: 'Wedding Anniversary',
      icon: IconWedding,
      color: '#EF3F61'
    },
    {
      name: 'Child birthday',
      icon: IconChild,
      color: '#FFB7B9'
    },
    {
      name: 'Pet',
      icon: IconPet,
      color: '#C57E3E'
    }
  ]

  iconsArray.forEach(icon => {
    icons[icon.name] = icon
  })

  return icons
}

export const importantDatesIcons = getIcons()
