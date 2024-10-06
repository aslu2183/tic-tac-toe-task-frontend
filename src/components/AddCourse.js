import React, { useEffect, useState } from "react";
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
import { useRouter } from 'next/router'

export default function AddCourse(props){
  const [inputs, setInputs] = useState({
    'course_branch' : '',
    'course_name'   : '',
    'course_desc'   : ''
  })
  
  const [errors, seterrors] = useState({
    'course_branch_error' : '',
    'course_name_error' : '',
  })

  const [helperText, sethelperText] = useState("Please wait branch list updating...")
  const [branches, setbranches]     = useState([])
  const [buttonloading, setbuttonloading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [updateData, setupdateData] = useState({})

  const router = useRouter()

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
      const url  = isEdit ? `/update-course/${router.query.id}` : 'add-course'
      
      Api().post(url,data)
      .then((res) => {
          setbuttonloading(false)
          const response = res.data
          if(response.status){
            const alertTitle = isEdit ? "Updated" : "Added"
            successAlert(alertTitle , response.message)
            props.changeTab(this,'list-course')
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
    Api().get('/get-branches')
    .then((res) => {
      const response = res.data
      if(response.status){
        setbranches(response.data.branches)
        sethelperText("")
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

  useEffect(() => {
    if(router.query?.id){
      setIsEdit(true)
      getCourseDetails(router.query?.id)
    }
  },[router])

  const getCourseDetails = (courseid) => {
    Api().post(`/get-course-details/${courseid}`,{})
    .then((res) => {
      const response = res.data
      if(response.status){
        const course_details = response.data.course
        setupdateData(course_details)
      }
      else{
        const errors = customizeErrors(response.data.errors)
        dangerAlert(response.message,errors)
      }
      
    })
    .catch((error) => {
      const message = (error?.response ? error.response.data.message : error?.message||'Undefined Error')
      dangerAlert('Network Error',message)
    })
  }

  useEffect(() => {
    if(isEdit){
      if(branches.length > 0 && Object.keys(updateData).length > 0){
        const branch = branches.find((branch) => branch.branch_name == updateData.branch.branch_name)
        setInputs({
          course_name   : updateData.course_name,
          course_desc   : updateData.course_desc,
          course_branch : branch.branch_id_generated
        })
      }  
    }  
    
  },[branches,updateData])
    
    return(
        <Grid container>
            <Grid item xs={12} md={12}>
            <Card>
            <CardHeader title={isEdit ? 'Update Course' : 'New Course'} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <form onSubmit={onSubmit} noValidate>
                <Grid container spacing={5}>
                <Grid item xs={12}>
                    <FormControl fullWidth error={errors['course_branch_error'] ? true : false} required>
                      <InputLabel id='form-layouts-separator-select-label'>Branch</InputLabel>
                      <Select
                        label='Branch'
                        defaultValue=''
                        value={inputs.course_branch}
                        id='form-layouts-separator-select'
                        labelId='form-layouts-separator-select-label'
                        onChange={onChangeText("course_branch")}
                      >
                      {
                        branches?.map((item) => {
                          return(
                            <MenuItem value={item.branch_id_generated} key={item.branch_id_generated}>{item.branch_name}</MenuItem>
                          )
                        })
                      }  
                       
                      </Select>
                      <FormHelperText>{errors['course_branch_error'] ? errors['course_branch_error'] : helperText ? helperText : ''}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label='Course' 
                      placeholder='Course' 
                      value={inputs?.course_name}
                      onChange={onChangeText("course_name")} 
                      required
                      error={errors['course_name_error'] ? true : false}
                      helperText={errors['course_name_error'] ?? ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      multiline
                      minRows={3}
                      label='Description' 
                      placeholder='Course Description' 
                      onChange={onChangeText("course_desc")} 
                      required
                      error={errors['course_desc_error'] ? true : false}
                      helperText={errors['course_desc_error'] ?? ''}
                      value={inputs?.course_desc||""}
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
                      }}
                    >
                      <LoadingButton type='submit' variant='contained' size='large' loading={buttonloading}>
                        {isEdit ? 'Update Course' : 'Create Course!'}
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