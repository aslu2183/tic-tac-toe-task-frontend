import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { FormHelperText } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import Api from 'src/helpers/Api'
import { dangerAlert, successAlert } from "src/helpers/Alerts";
import { customizeErrors } from "src/helpers/Utils";
import { ConsoleNetworkOutline } from 'mdi-material-ui'

export default function AddCertificate(props){
  const [inputs, setInputs] = useState({
    'upload_student'     : '',
    'upload_course'      : '',
    'upload_admission'   : '',
    'upload_certificate' : '',
  })

  const [errors, seterrors] = useState({
    'upload_student_error'     : '',
    'upload_course_error'      : '',
    'upload_admission_error'   : '',
    'upload_certificate_error' : '',
  })

  const [students, setstudents]           = useState([])
  const [courses,setcourses]              = useState([])
  const [buttonloading, setbuttonloading] = useState(false)

  const [autocompleteloader, setautocompleteloader] = useState(false)

  const searchValue = (event, value) => {
    if(value.length >= 3){
      setautocompleteloader(true)
      
      const data = {
        search_key : value.trim()
      }  
      Api().post('/search-students',data)
      .then((res) => {
        setautocompleteloader(false)
        const response = res.data
        if(response.status){
          const students = response.data.students?.map((item) => {
            return {
              label : item.student_name,
              regno : item.student_regno,
              id    : item.student_id_generated,
              course: {
                id   : item.course.course_id_generated,
                name : item.course.course_name 
              } 
            }
          })
          setstudents(students)
        }
        else{
          console.log("response ",response.message)
        }
        
      })
      .catch((error) => {
        setautocompleteloader(false)
        const message = (error?.response ? error.response.data.message : error?.message||'Undefined Error')
        dangerAlert('Network Error',message)
      })
    }
  }

  const setDropDownValue = (event,value) => {
    if(value){
      setInputs((prevState) => ({
        ...prevState,
        upload_admission : value.regno,
        upload_student   : value.id,
        upload_course    : value.course.id
      }))
      setcourses([value.course])
    }
    else{
      setInputs((prevState) => ({
        ...prevState,
        upload_admission : "",
        upload_student   : "",
        upload_course    : ""
      }))
      setcourses([])
    }
    seterrors((prevState) => ({
      ...prevState,
      'upload_student_error'     : '',
      'upload_course_error'      : '',
      'upload_admission_error'   : '',
    }))  
    
  }

  const onChangeText = (key,field="") => (event) => {
    setInputs({
        ...inputs,
        [key] : field == "date" ? event : field == "file" ? event.target.files[0] : event.target.value
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    let isValidated = true 
    Object.entries(inputs).forEach(([key,value]) => {
        if(value == "" || value == null){
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
      setbuttonloading(false)
      const data = {...inputs}
      Api().post('/upload-certificates',data, {
        headers : {
            'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        setbuttonloading(false)
        const response = res.data
        if(response.status){
          successAlert("Uploaded",response.message)
          props.changeTab(this,'list-certificate')
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

  // console.log("Inputs ",inputs)
  // console.log("Courses ",courses)
    return (
      <Grid container >
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title='Upload Student Certificate' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <form onSubmit={onSubmit} noValidate>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    {/* <TextField 
                      fullWidth 
                      label='Name' 
                      placeholder='Student Name'
                      required
                    /> */}
                    <Autocomplete
                      disablePortal
                      id="student-name"
                      options={students}
                      loading={autocompleteloader}
                      loadingText={"Fetching Students..."}
                      isOptionEqualToValue={(options,value) => options.label === value.label}
                      filterOptions={(x) => x}
                      onInputChange={searchValue}
                      onChange={setDropDownValue}
                      renderInput={(params) => {
                        return(
                          <TextField 
                            {...params} 
                            label="Student"
                            placeholder="Type 3 Characters"
                            required
                            error={errors['upload_student_error'] ? true : false}
                            helperText={errors['upload_student_error'] ?? ''}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {autocompleteloader ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={errors['upload_course_error'] ? true : false} required>
                      <InputLabel id='form-layouts-separator-select-label'>Course</InputLabel>
                      <Select
                        label='Course'
                        defaultValue=''
                        value={inputs['upload_course']}
                        id='form-layouts-separator-select'
                        labelId='form-layouts-separator-select-label'
                        onChange={onChangeText('upload_course')}
                      >
                        {
                          courses?.map((item) => {
                              return(
                                  <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                              )
                          })
                        }
                      </Select>
                      {errors['upload_course_error'] ? <FormHelperText>{ errors['upload_course_error'] }</FormHelperText> : null }
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Admission No'
                      placeholder='Admission No'
                      helperText='Student Admission Number'
                      required
                      value={inputs['upload_admission']}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type='file'
                      hiddenLabel
                      required
                      error={errors['upload_certificate_error'] ? true : false}
                      helperText={errors['upload_certificate_error'] ? errors['upload_certificate_error'] : 'Accept only pdf and image files.'}
                      onChange={onChangeText("upload_certificate","file")}
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
                        Upload Certificate!
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