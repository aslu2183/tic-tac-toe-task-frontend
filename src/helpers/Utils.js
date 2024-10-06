export const customizeErrors = (errors) => {
    if(typeof errors === 'object'){
        let errString = '<ul style="list-style:none;text-align:left">'
        Object.values(errors).map((item) => {
            errString+="<li>"+item[0]+"</li>"
        })
        errString+="</ul>"
        return errString
    }
    else{
        return errors
    }
}

export const formatDate = (date) => {
    const d = new Date(date)
    const year  = d.getFullYear()
    const month = d.getMonth() + 1
    const day   = d.getDate()
    
    if(month < 10) month = '0'+month
    if(day < 10) day = '0'+day

    return [year, month, day].join("-")
}