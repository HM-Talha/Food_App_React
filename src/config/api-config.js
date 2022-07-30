import axios from 'axios';
import {adminAuthorizer} from './constants';

// export const baseUrl = process.env.REACT_APP_API_ENDPOINT;
export const baseUrl = process.env.NODE_ENV === 'production' ? "https://api.pikky.io/api/v1" : ""


export const initAxios = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('__auth')?.replaceAll("\"", "")}`
    axios.interceptors.response.use(
        function (successRes) {
            return successRes;
        },
        function (error) {
            if(error.response.status === 401) {
              window.location.href = "/"
            }
            return Promise.reject(error);
        }
    );
}

export const getHeader = () => {
    const is_admin_loggedin = localStorage.getItem('__is_admin_loggedIn');
    let token = is_admin_loggedin
        ? adminAuthorizer.getHeader()
        : localStorage.getItem('__auth');
    return (axios.defaults.headers.common['Authorization'] = `Bearer ${token}`);
};
