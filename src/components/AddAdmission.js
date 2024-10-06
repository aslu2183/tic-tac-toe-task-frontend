import React, {useState, forwardRef, useEffect} from 'react'
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
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FormHelperText } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import Api from "src/helpers/Api";
import { dangerAlert, successAlert } from "src/helpers/Alerts";
import { customizeErrors, formatDate } from "src/helpers/Utils";

export default function AddAdmission(props){
    
    const [inputs, setInputs] = useState({
        'student_branch' : '',
        'student_name'   : '',
        'student_course' : '',
        'student_admission_no' : '',
        'student_dob'    : '',
        'student_doj'    : '',
    })
    
    const [errors, seterrors] = useState({
        'student_branch_error' : '',
        'student_name_error'   : '',
        'student_course_error' : '',
        'student_admission_no_error' : '',
        'student_dob_error'    : '',
        'student_doj_error'    : '',
    })

    const [helperText, sethelperText] = useState("Please wait branch list updating...")
    const [branches, setbranches]     = useState([])
    const [courses, setcourses]       = useState([])
    const [buttonloading, setbuttonloading] = useState(false)

    const CustomInput = forwardRef((props, ref) => {
        return <TextField 
                    fullWidth {...props} 
                    inputRef={ref} 
                    autoComplete='off' 
                    required
                    error={ errors[props.custom_id+"_error"] ? true : false }
                    helperText={errors[props.custom_id+"_error"] ?? ''}
                />
    })

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
            data.student_dob = formatDate(data.student_dob)
            data.student_doj = formatDate(data.student_doj)
            
            Api().post('/add-student',data, {
                headers : {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                setbuttonloading(false)
                const response = res.data
                if(response.status){
                    successAlert("Added",response.message)
                    props.changeTab(this,'list-admission')
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
        else{
            console.log("Validation Errors ",inputs)
        }
    }

    const onChangeText = (key,field="") => (event) => {
        setInputs({
            ...inputs,
            [key] : field == "date" ? event : field == "file" ? event.target.files[0] : event.target.value
        })
    }

    useEffect(() => {
        Api().get('/get-student-options')
        .then((res) => {
            const response = res.data
            if(response.status){
                setbranches(response.data.branches)
                setcourses(response.data.courses)
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

    

    return(
        <DatePickerWrapper>
        <Grid container>
            <Grid item xs={12} md={12}>
                <Card>
                    <CardHeader title='Admission Info' titleTypographyProps={{ variant: 'h6' }} />
                    <CardContent>
                        <form onSubmit={onSubmit} noValidate>
                            <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label='Name' 
                                    placeholder='Student Name'
                                    required
                                    error={errors['student_name_error'] ? true : false}
                                    helperText={errors['student_name_error'] ?? ''}
                                    onChange={onChangeText('student_name')}
                                 />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={errors['student_branch_error'] ? true : false} required>
                                    <InputLabel id='form-layouts-separator-select-label-branch'>Branch</InputLabel>
                                    <Select
                                        label='Branch'
                                        defaultValue=''
                                        id='form-layouts-separator-select'
                                        labelId='form-layouts-separator-select-label-branch'
                                        onChange={onChangeText('student_branch')}
                                        
                                    >
                                    {
                                        branches?.map((item) => {
                                            return(
                                                <MenuItem value={item.branch_id_generated} key={item.branch_id_generated}>{item.branch_name}</MenuItem>
                                            )
                                        })
                                    }  
                                    </Select>
                                    <FormHelperText>{errors['student_branch_error'] ? errors['student_branch_error'] : helperText ? helperText : ''}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={errors['student_course_error'] ? true : false} required>
                                <InputLabel id='form-layouts-separator-select-label-course'>Course</InputLabel>
                                <Select
                                    label='Course'
                                    defaultValue=''
                                    id='form-layouts-separator-select'
                                    labelId='form-layouts-separator-select-label-course'
                                    onChange={onChangeText('student_course')}
                                    
                                >
                                    {
                                        courses?.map((item) => {
                                            return(
                                                <MenuItem value={item.course_id_generated} key={item.course_id_generated}>{item.course_name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                                { errors['student_course_error'] ? <FormHelperText>{errors['student_course_error']}</FormHelperText> : null }
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label='Admission No'
                                    placeholder='Admission No'
                                    required
                                    error={errors['student_admission_no_error'] ? true : false}
                                    helperText={errors['student_admission_no_error'] ?? ''}
                                    onChange={onChangeText('student_admission_no')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    selected={inputs['student_dob']}
                                    showYearDropdown
                                    showMonthDropdown
                                    placeholderText='MM-DD-YYYY'
                                    customInput={<CustomInput label={"Date of Birth"} custom_id="student_dob"/>}
                                    id='form-layouts-separator-date'
                                    onChange={onChangeText("student_dob","date")}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label='Address'
                                    placeholder='Student Address'
                                    onChange={onChangeText('student_addr')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    selected={inputs['student_doj']}
                                    showYearDropdown
                                    showMonthDropdown
                                    placeholderText='MM-DD-YYYY'
                                    customInput={<CustomInput label={"Date of Joining"} custom_id="student_doj"/>}
                                    id='form-layouts-separator-date'
                                    onChange={onChangeText("student_doj","date")}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Upload SSLC"
                                    type="file"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={onChangeText("student_sslc","file")}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Upload Aaadhar"
                                    type="file"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={onChangeText("student_aadhar","file")}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Others"
                                    type="file"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={onChangeText("student_others","file")}
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
                                <LoadingButton type='submit' variant='contained' size='large' loading={false}>
                                    Create Admission!
                                </LoadingButton>
                                
                                </Box>
                            </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>        
            </Grid>
        </Grid>    
        </DatePickerWrapper>
    )
}