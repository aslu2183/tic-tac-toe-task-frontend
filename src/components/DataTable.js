import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Grid } from '@mui/material';

export default function DataTable(props){
    const [text,setText]         = React.useState("")
    
    const setFilterText = (e) => {
        if(!props.isloading){
            setText(e.target.value)
            if(props?.onSearch){
                
                const keys = props.columns.filter((item) => {
                    return item.filterable || !item.hasOwnProperty('filterable')
                }).map((item) => item.field)

                props.onSearch(e.target.value,keys)
            }
        }
    }
    
    return (
        <Box p={3}>
            <Grid container mb={2} justifyContent="flex-end">
                <Grid item md={3} xs={12}>
                    <TextField fullWidth placeholder='Search Here' onChange={setFilterText} value={text}></TextField>
                </Grid>
            </Grid>
            
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                    <DataGrid
                        initialState={{
                            pagination: {
                              pageSize: 10,
                            },
                        }}   
                        rows={props?.rows} 
                        page={props?.currentPage||0}
                        rowCount={props?.totalRows||0}  
                        columns={props?.columns} 
                        disableSelectionOnClick
                        autoHeight
                        paginationMode='server'
                        sortingMode='server'
                        onPageSizeChange={props.onLimitChange}
                        onPageChange={props.onPageChange}
                        rowsPerPageOptions={[10, 50, 100]}
                        onSortModelChange={props.onSorting}
                        pagination
                        loading={props.isloading}>
                    </DataGrid>
                </div>
            </div> 
        </Box>        
        
    )    
}