import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import {useRouter} from 'next/router'
import { useSettings } from 'src/@core/hooks/useSettings'
import Loader from './Loader'

export default function Auth({children}){
    const user = useSelector(state => state.auth)
    const router = useRouter()
    const { settings } = useSettings()
        
    useEffect(() => {
        if(!user.isAuthenticated){
            router.push("/")
        }
    },[])
   
    return(
        <>
            {settings.pageloader ? <Loader></Loader> : children}
        </>
        
    )
}