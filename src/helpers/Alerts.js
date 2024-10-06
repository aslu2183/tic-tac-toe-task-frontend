import Swal from 'sweetalert2'

export const successAlert = (title="Success",message="message",buttonText="Ok",isToast=false) => {
    Swal.fire({
        title: title,
        text: message,
        icon: 'success',
        toast: isToast,
        confirmButtonText: buttonText,
        position:isToast ? "top-end" : 'center',
        timer:isToast ? 2000 : undefined,
        showConfirmButton:isToast ? false : true
    })
}

export const dangerAlert = (title="Error",message="message",buttonText="Ok",isToast=false) => {
    Swal.fire({
        title: title,
        html: message,
        icon: 'error',
        toast: isToast,
        confirmButtonText: buttonText,
        position:isToast ? "top-end" : 'center',
        timer:isToast ? 2000 : undefined,
        showConfirmButton:isToast ? false : true
    })
}