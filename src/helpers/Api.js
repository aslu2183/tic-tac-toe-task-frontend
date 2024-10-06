import axios from 'axios';
import { store } from '../redux/Store'

let BaseApi = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL,
    
})

let Api = function () {
    const user = store.getState().auth
    BaseApi.defaults.headers.common['Accept'] = 'application/json';
    if(user.isAuthenticated){
        const token = user.token
        BaseApi.defaults.headers.common['Authorization'] = 'Bearer '+token;
    }
    return BaseApi    
}

export default Api;