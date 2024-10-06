import React,{ useEffect, useState } from "react";
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton';
import Api from "src/helpers/Api";
import { dangerAlert, successAlert } from "src/helpers/Alerts";
import { customizeErrors } from 'src/helpers/Utils'

export default function AddBranch(props){
    const [inputs, setInputs] = useState({
        'branch_name' : '',
        'branch_authorised_person' : '',
        'branch_phone': '',
        'branch_address' : ''
    })
    
    const [errors, seterrors] = useState({
        'branch_name_error' : '',
        'branch_authorised_person_error' : '',
        'branch_phone_error': '',
        'branch_address_error' : ''
    })


    const [buttonloading, setbuttonloading] = useState(false)
    
    const onSubmit = (e) => {
        e.preventDefault()
        let isValidated = true 
        Object.entries(inputs).forEach(([key,value]) => {
            if(value == ""){
                seterrors((prevState) => ({
                    ...prevState,
                    [key+"_error"] : "Field Required"
                }))
                isValidated = false
            }
            else{
                seterrors((prevState) => ({
                    ...prevState,
                    [key+"_error"] : ""
                }))
            }
        })
        if(isValidated){
            setbuttonloading(true)
            const data = inputs
            Api().post('/add-branch',data)
            .then((res) => {
                setbuttonloading(false)
                const response = res.data
                if(response.status){
                    successAlert("Added",response.message)
                    props.changeTab(this,'list-branch')
                }
                else{
                    const errors = customizeErrors(response.data.errors)
                    dangerAlert(response.message,errors)
                }    
            })
            .catch((error) => {
                setbuttonloading(false)
                const message = (error?.response ? error.response.data.message : error?.message||'Undefined Error')
                dangerAlert('Network Error',message)
            })
        }
        
    }

    const onChangeText = (prop) => (event) => {
        setInputs({
            ...inputs,
            [prop] : event.target.value
        })
    }
    
    return(
        <Grid container>
            <Grid item xs={12} md={12}>
                <Card>
                    <CardHeader title='New Branch' titleTypographyProps={{ variant: 'h6' }} />
                    <CardContent>
                        <form onSubmit={onSubmit} noValidate>
                            <Grid container spacing={5}>
                            
                                <Grid item xs={12}>
                                    <TextField 
                                        fullWidth 
                                        label='Branch Name' 
                                        placeholder='Branch Name' 
                                        onChange={onChangeText("branch_name")} 
                                        required 
                                        error={errors['branch_name_error'] ? true : false}
                                        helperText={errors['branch_name_error'] ?? ''}
                                    />
                                </Grid>
                            
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Authorised Person'
                                        placeholder='Authorised Person Name'
                                        onChange={onChangeText("branch_authorised_person")}
                                        required
                                        error={errors['branch_authorised_person_error'] ? true : false}
                                        helperText={errors['branch_authorised_person_error'] ?? ''}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Phone No'
                                        placeholder='+1-123-456-8790'
                                        onChange={onChangeText("branch_phone")}
                                        required
                                        error={errors['branch_phone_error'] ? true : false}
                                        helperText={errors['branch_phone_error'] ?? ''}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label='Address'
                                    placeholder='Branch Address'
                                    sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                                    onChange={onChangeText("branch_address")}
                                    required
                                    error={errors['branch_address_error'] ? true : false}
                                    helperText={errors['branch_address_error'] ?? ''}
                                    />
                                </Grid>
                            
                                <Grid item xs={12}>
                                    <Box
                                    sx={{
                                        gap: 5,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <LoadingButton type='submit' variant='contained' size='large' loading={buttonloading}>
                                            Create Branch!
                                        </LoadingButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}