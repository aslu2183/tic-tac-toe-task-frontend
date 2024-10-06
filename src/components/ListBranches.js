import React from 'react'
import Grid from '@mui/material/Grid'
import CustomDataTable from './DataTable'
import Api from 'src/helpers/Api';
import { dangerAlert, successAlert } from "src/helpers/Alerts";
import { customizeErrors } from "src/helpers/Utils";

export default function ListBranches(){
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
        field : 'branch_name',
        headerName : 'Branch',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    },{
        field : 'branch_authorised_person',
        headerName : 'Authorised Person',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    },{
        field : 'branch_phone',
        headerName : 'Phone',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    },{
        field : 'branch_address',
        headerName : 'Address',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    },{
        field : 'students_count',
        headerName : 'Students',
        flex:0.3,
        disableColumnMenu:true,
        sortable:false,
        filterable:false,
        headerAlign:'center',
        align:'center',
        minWidth:100
    },{
        field : 'courses_count',
        headerName : 'Courses',
        flex:0.3,
        disableColumnMenu:true,
        sortable:false,
        filterable:false,
        headerAlign:'center',
        align:'center',
        minWidth:100
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
        
        Api().get('/get-branches-list',{
            params:data
        })
        .then((res) => {
            const response = res.data
            if(response.status){
                const rows = response.data.branches.map((item, i) => {
                    return {
                        ...item,
                        id          : item.branch_id_generated,
                        slno        : response.data.index + i,
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