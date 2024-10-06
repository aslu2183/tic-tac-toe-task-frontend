// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import TrayArrowUp from 'mdi-material-ui/TrayArrowUp'
import AccountMultiplePlus from 'mdi-material-ui/AccountMultiplePlus'
import SourceBranchPlus from 'mdi-material-ui/SourceBranchPlus'
import { AccountGroup } from 'mdi-material-ui'
import BookPlus from 'mdi-material-ui/BookPlus'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },
   
    {
      sectionTitle: 'Modules'
    },
  
    {
      title: 'Play Ground',
      icon: AccountGroup,
      path: '/play-ground',
      
    },
   
  ]
}

export default navigation
