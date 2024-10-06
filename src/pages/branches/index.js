import React, {useState, forwardRef} from 'react'
import CustomTab from 'src/components/CustomTab'
import PlusIcon from 'mdi-material-ui/PlusThick'
import ViewListIcon from 'mdi-material-ui/ViewList'
import AddBranch from 'src/components/AddBranch'
import ListBranch from 'src/components/ListBranches'
import Auth from 'src/components/Auth'




export default function Admission(){
    const tabs = [
        {
            value : "list-branch",
            label : "View",
            labelIconComponent: ViewListIcon,
            route : "/branches",
            tabScreen : (props) => <ListBranch {...props}></ListBranch>
        },
        {
            value : "add-branch",
            label : "Branch",
            labelIconComponent: PlusIcon,
            route : "/branches",
            tabScreen : (props) => <AddBranch {...props}></AddBranch>
        }
    ]
    
    return(
        <Auth>
            <CustomTab tabs={tabs}></CustomTab>
        </Auth>    
    )
}