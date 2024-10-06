// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
// import AccountOutline from 'mdi-material-ui/AccountOutline'
// import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
// import InformationOutline from 'mdi-material-ui/InformationOutline'

// ** Demo Tabs Imports
// import TabInfo from 'src/views/account-settings/TabInfo'
// import TabAccount from 'src/views/account-settings/TabAccount'
// import TabSecurity from 'src/views/account-settings/TabSecurity'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const CustomTab = ({tabs}) => {
  
  const router = useRouter()

  const handleChange = (event, newValue) => {
    const getRoute = tabs.find((tab) => tab.value == newValue)
    router.push(`${getRoute.route}/?tab=${newValue}`)
  }

  let value = router?.query?.tab ? router.query.tab : tabs[0].value

  return (
    <Card>
        <TabContext value={value}>
            <TabList
                onChange={handleChange}
                aria-label='account-settings tabs'
                sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
            >
            {
                tabs.map((item, index) => {
                    const LabelIcon = item.labelIconComponent

                    return (
                        <Tab
                            value={item.value}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LabelIcon></LabelIcon>
                                    <TabName>{item.label}</TabName>
                                </Box>
                            }
                            key={index}
                        />
                    )    
                })
            }    
            </TabList>
            {
                tabs.map((item,index) => {
                    const TabScreen = item.tabScreen
                    
                    return(
                        <TabPanel sx={{ p: 0 }} value={item.value} key={index}>
                            <TabScreen changeTab={handleChange}></TabScreen>
                        </TabPanel>
                    )
                })
            }
        </TabContext>
    </Card>
  )
}

export default CustomTab
