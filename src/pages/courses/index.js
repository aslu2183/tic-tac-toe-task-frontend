import React from 'react'
import CustomTab from 'src/components/CustomTab'
import PlusIcon from 'mdi-material-ui/PlusThick'
import ViewListIcon from 'mdi-material-ui/ViewList'
import AddCourse from 'src/components/AddCourse'
import ListCourses from 'src/components/ListCourses'
import Auth from 'src/components/Auth'


export default function Course(){
    const tabs = [
        {
            value : "list-course",
            label : "View",
            route : '/courses',
            labelIconComponent: ViewListIcon,
            tabScreen : (props) => <ListCourses {...props}></ListCourses>
        },
        {
            value : "add-course",
            label : "Course",
            route : '/courses',
            labelIconComponent: PlusIcon,
            tabScreen : (props) => <AddCourse {...props}></AddCourse>
        }
    ]
    
    return(
        <Auth>
            <CustomTab tabs={tabs}></CustomTab>
        </Auth>    
    )
}