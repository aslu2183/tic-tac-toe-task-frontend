import React from 'react'
import Grid from '@mui/material/Grid'
import CustomDataTable from './DataTable'
import Api from 'src/helpers/Api';
import { dangerAlert, successAlert } from "src/helpers/Alerts";
import { customizeErrors } from "src/helpers/Utils";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from 'mdi-material-ui/Delete';
import EditIcon from 'mdi-material-ui/Pencil'
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router'

export default function ListCourses(props){
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
        field : 'course_name',
        headerName : 'Course',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    },{
        field : 'branch',
        headerName : 'Branch',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        minWidth:200
    },{
        field : 'actions',
        headerName : 'Actions',
        flex:1,
        disableColumnMenu:true,
        sortable:false,
        filterable:false,
        minWidth:200,
        renderCell : (params) => {
            return (
                <Stack direction="row" spacing={1}>
                    <IconButton aria-label="delete" color='error' onClick={() => deleteCourse(params.row.id)}>
                        <DeleteIcon fontSize="inherit"/>
                    </IconButton>
                    <IconButton aria-label="edit" color='primary' onClick={() => editCourse(params.row.check)}>
                        <EditIcon fontSize="inherit"/>
                    </IconButton>
                </Stack>    
            )
        }
    }])

    const router = useRouter()

    React.useEffect(() => {
        
        setloading(true)
              
        const data = {
            limit : pageSize,
            page  : page + 1,
            term  : text.trim(),
            fields: fields,
            sortable: sortable
        }
        
        Api().get('/get-courses-list',{
            params:data
        })
        .then((res) => {
            const response = res.data
            if(response.status){
                const rows = response.data.courses.map((item, i) => {
                    return {
                        id          : item.course_id_generated,
                        slno        : response.data.index + i,
                        course_name : item.course_name,
                        branch      : item.branch.branch_name,
                        created_at  : item.created_at,
                        check       : item.course_id_generated
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


    const editCourse = (id) => {
       router.push(`/courses/?tab=add-course&id=${id}`)
    }

    const deleteCourse = (id) => {
        console.log("Delete Id ",id);
    }

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