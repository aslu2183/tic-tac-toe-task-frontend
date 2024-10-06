import React, {useState, forwardRef} from 'react'
import CustomTab from 'src/components/CustomTab'
import PlusIcon from 'mdi-material-ui/PlusThick'
import ViewListIcon from 'mdi-material-ui/ViewList'
import AddAdmission from 'src/components/AddAdmission'
import ListAdmissions from 'src/components/ListAdmissions'
import Auth from 'src/components/Auth'
import PlayGround from 'src/components/Playground'



export default function Admissions(){
    const tabs = [
        {
            value : "play-ground",
            label : "View",
            labelIconComponent: ViewListIcon,
            route : "/play-ground",
            tabScreen : PlayGround
        }
    ]
    
    return(
        <Auth>
            <CustomTab tabs={tabs}></CustomTab>
        </Auth>    
    )
}