/// ** MUI Imports
import React, {useEffect, useState} from 'react'
import Grid from '@mui/material/Grid'

// ** Icons Imports
// import Poll from 'mdi-material-ui/Poll'
// import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
// import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
// import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
// import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Auth from 'src/components/Auth'
import Loader from 'src/components/Loader'
import { useSettings } from 'src/@core/hooks/useSettings'


const Dashboard = () => {
  const { settings, saveSettings } = useSettings()
  useEffect(() => {
    saveSettings({
      ...settings,
      pageloader : false
    })
   
    
  },[])
  
  return (
    <Auth>
      <ApexChartWrapper>
      
      </ApexChartWrapper>
    </Auth>  
  )
}

export default Dashboard
