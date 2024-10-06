import React, {useState, forwardRef} from 'react'
import CustomTab from 'src/components/CustomTab'
import PlusIcon from 'mdi-material-ui/PlusThick'
import ViewListIcon from 'mdi-material-ui/ViewList'
import AddCertificate from 'src/components/AddCertificate'
import ListCertificates from 'src/components/ListCertificates'
import Auth from 'src/components/Auth'


export default function Admission(){
    const tabs = [
        {
            value : "list-certificate",
            label : "View",
            labelIconComponent: ViewListIcon,
            route : "/certificates",
            tabScreen : ListCertificates
        },
        {
            value : "upload-certificate",
            label : "Upload",
            labelIconComponent: PlusIcon,
            route : "/certificates",
            tabScreen : AddCertificate
        }
    ]
    
    return(
        <Auth>
            <CustomTab tabs={tabs}></CustomTab>
        </Auth>    
    )
}