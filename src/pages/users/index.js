import React, {useState, forwardRef} from 'react'
import CustomTab from 'src/components/CustomTab'
import PlusIcon from 'mdi-material-ui/PlusThick'
import ViewListIcon from 'mdi-material-ui/ViewList'
import AddUser from 'src/components/AddUser'
import ListUsers from 'src/components/ListUsers'




export default function Users(){
    const tabs = [
        {
            value : "list-users",
            label : "View",
            labelIconComponent: ViewListIcon,
            route : "/users",
            tabScreen : ListUsers
        },
        {
            value : "add-user",
            label : "User",
            labelIconComponent: PlusIcon,
            route : "/users",
            tabScreen : AddUser
        }
    ]
    
    return(
        <CustomTab tabs={tabs}></CustomTab>
    )
}