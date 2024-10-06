import React, { useState, useEffect } from "react";
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
import { FormHelperText } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Api from "src/helpers/Api";
import { dangerAlert, successAlert } from "src/helpers/Alerts";
import { customizeErrors } from "src/helpers/Utils";


export default function AddUser(props){
  const [inputs, setInputs] = useState({
    'user_branch'   : '',
    'user_name'     : '',
    'user_email'    : '',
    'user_password' : '',
    'user_role'     : ''
  })
  
  const [errors, seterrors] = useState({
    'user_branch_error' : '',
    'user_name_error'   : '',
    'user_email_error'  : '',
    'user_password_error' : '',
  })

  const [helperText, sethelperText] = useState("Please wait branch list updating...")
  const [branches, setbranches]     = useState([])
  const [roles, setroles]           = useState([])
  const [buttonloading, setbuttonloading] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    let isValidated = true 
    const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    Object.entries(inputs).forEach(([key,value]) => {
      if(value == "" || (key == 'user_password' && value.length < 8) || (key == 'user_email' && !emailRegExp.test(value))){
        let msg = "Field Required"
        if(key == 'user_password' && value.length < 8 && value){
          msg = "Password contain minimum 8 characters."
        }
        if(key == 'user_email' && !emailRegExp.test(value) && value){
          msg = "Invalid email format."
        }
        seterrors((prevState) => ({
            ...prevState,
            [key+"_error"] : msg
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
      Api().post('/add-user',data)
      .then((res) => {
        setbuttonloading(false)
        const response = res.data
        if(response.status){
          successAlert("Added",response.message)
          props.changeTab(this,'list-users')
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

  useEffect(() => {
    Api().get('/get-user-options')
    .then((res) => {
      const response = res.data
      if(response.status){
        const role = response.data.roles.find((item) => item.role_name.toLowerCase() === 'normal')
        setbranches(response.data.branches)
        setroles(response.data.roles)
        sethelperText("")
        setInputs((prevState) => ({
          ...prevState,
          user_role : role.role_id
        }))
      }
      else{
        sethelperText(response.message)
      }
      
    })
    .catch((error) => {
      const message = (error?.response ? error.response.data.message : error?.message||'Undefined Error')
      sethelperText(message)
    })
  },[])

 

    return(
        <Grid container>
            <Grid item xs={12} md={12}>
            <Card>
            <CardHeader title='New User' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <form onSubmit={onSubmit} noValidate>
                <Grid container spacing={5}>
                <Grid item xs={12}>
                    <FormControl fullWidth error={errors['user_branch_error'] ? true : false} required>
                      <InputLabel id='form-layouts-separator-select-label'>Branch</InputLabel>
                      <Select
                        label='Branch'
                        defaultValue=''
                        id='form-layouts-separator-select'
                        labelId='form-layouts-separator-select-label'
                        onChange={onChangeText('user_branch')}
                      >
                        
                      {
                        branches?.map((item) => {
                          return(
                            <MenuItem value={item.branch_id_generated} key={item.branch_id_generated}>{item.branch_name}</MenuItem>
                          )
                        })
                      }  
                      </Select>
                      <FormHelperText>{errors['user_branch_error'] ? errors['user_branch_error'] : helperText ? helperText : ''}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label='Name' 
                      placeholder='Name' 
                      onChange={onChangeText('user_name')} 
                      required
                      error={errors['user_name_error'] ? true : false}
                      helperText={errors['user_name_error'] ?? ''}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Email'
                      placeholder='Email id here'
                      type="email"
                      error={errors['user_email_error'] ? true : false}
                      helperText={errors['user_email_error'] ?? ''}
                      onChange={onChangeText('user_email')} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type='password'
                      label='Password'
                      placeholder="Password here"
                      error={errors['user_password_error'] ? true : false}
                      helperText={errors['user_password_error'] ?? 'Minimum 8 Characters needed.'}
                      onChange={onChangeText('user_password')} 
                      
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='form-layouts-separator-select-label-role'>User Role</InputLabel>
                      <Select
                        label='User Role'
                        value={inputs['user_role']}
                        id='form-layouts-separator-select'
                        labelId='form-layouts-separator-select-label-role'
                        onChange={onChangeText('user_role')}
                      >
                        
                      {
                        roles?.map((item) => {
                          return(
                            <MenuItem value={item.role_id} key={item.role_id}>{item.role_name}</MenuItem>
                          )
                        })
                      }  
                        
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        gap: 5,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <LoadingButton type='submit' variant='contained' size='large'>
                        Create User!
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