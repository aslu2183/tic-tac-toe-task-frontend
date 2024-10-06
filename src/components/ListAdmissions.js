import React from 'react'
import Grid from '@mui/material/Grid'
import CustomDataTable from './DataTable'
import Api from 'src/helpers/Api';
import { dangerAlert, successAlert } from "src/helpers/Alerts";
import { customizeErrors } from "src/helpers/Utils";

export default function ListAdmissions(){

    const [pageSize,setPageSize] = React.useState(10)
    const [page,setPage]         = React.useState(0)
    const [rowCount,setRowCount] = React.useState(0)
    const [rows,setRows]         = React.useState([])
    const [loading, setloading]  = React.useState(true)
    const [fields, setfields]    = React.useState([])
    const [sortable, setsortable]= React.useState([])
    const [text,setText]         = React.useState("")

    const [columns, setColumns]  = React.useState([{
        field : 'slno',
        headerName : 'Slno',
        sortable:false,
        filterable: false,
        disableColumnMenu:true,
        headerAlign:'center',
        align:'center',
        flex:0.2,
        minWidth:100
    },{
        field : 'created_at',
        headerName : 'Created On',
        flex:1,
        disableColumnMenu:true,
        filterable : false,
        minWidth:200
    },{
        field : 'student_name',
        headerName : 'Name',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    },{
        field : 'student_regno',
        headerName : 'Admission No',
        flex:0.5,
        disableColumnMenu:true,
        sortable:false,
        minWidth:150
    },{
        field : 'student_dob',
        headerName : 'DOB',
        flex:0.5,
        disableColumnMenu:true,
        sortable:false,
        filterable:false,
        minWidth:150
    },{
        field : 'student_doj',
        headerName : 'DOJ',
        flex:0.5,
        disableColumnMenu:true,
        sortable:false,
        filterable:false,
        minWidth:150
    },{
        field : 'branch',
        headerName : 'Branch',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    },{
        field : 'course',
        headerName : 'Course',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    }])

    React.useEffect(() => {
        setloading(true)
              
        const data = {
            limit : pageSize,
            page  : page + 1,
            term  : text.trim(),
            fields: fields,
            sortable: sortable
        }
        
        Api().get('/get-students-list',{
            params:data
        })
        .then((res) => {
            const response = res.data
            if(response.status){
                const rows = response.data.students.map((item, i) => {
                    return {
                        id   : item.student_id_generated,
                        slno : response.data.index + i,
                        student_name : item.student_name,
                        student_regno: item.student_regno,
                        student_dob  : item.student_dob,
                        student_doj  : item.student_doj,
                        branch       : item.branch.branch_name,
                        course       : item.course.course_name,
                        created_at   : item.created_at
                    }
                })
                setRowCount(response.data.total)
                setRows(rows)
                setloading(false)
            }
            else{
                setloading(false)  
                const errors = customizeErrors(response.data.errors)
                dangerAlert(response.message,errors)
            }  
        })
        .catch((error) => {
            setloading(false)
            const message = (error?.response ? error.response.data.message : error?.message||'Undefined Error')
            dangerAlert('Network Error',message)
        })
    },[page,pageSize,text.trim(),sortable])

    React.useEffect(() => {
        setPage(0)
    },[pageSize,text])

    return (
        <Grid container>
            <Grid item xs={12} md={12}>
                <CustomDataTable
                    limit={pageSize}
                    currentPage={page}
                    totalRows={rowCount}
                    isloading={loading}
                    rows={rows}
                    columns={columns}
                    onLimitChange={(newPageSize) => setPageSize(newPageSize)}
                    onPageChange={(page) => setPage(page)}
                    onSorting={(sortModel) => setsortable(sortModel)}
                    onSearch={(searchKey,fields) => {
                        setfields(fields)
                        setText(searchKey)
                    }}>
                </CustomDataTable>
            </Grid>
        </Grid>
    )
}