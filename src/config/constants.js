// import { history } from '../routes';
// import { notify } from '../components/Notifier/Notifier';
//
// let authUserHeader = undefined;
// const userKey = '__auth';
// const userKey2 = '__is_user_loggedIn';
//
// export const user_authorizer = {
//   setHeader: (authorizationHeader) => {
//     authUserHeader = authorizationHeader;
//     if (authUserHeader === undefined) localStorage.removeItem(userKey);
//     else {
//       localStorage.setItem(userKey, authorizationHeader);
//       localStorage.setItem(userKey2, 'true');
//     }
//   },
//   getHeader: () => {
//     authUserHeader = authUserHeader || localStorage.getItem(key);
//     return authUserHeader;
//   }
// };
//
// let authHeader = undefined;
// const key = '__auth';
// const key2 = '__is_loggedIn';
//
// export const LOCATION = '__location';
//
// export const authorizer = {
//   setHeader: (authorizationHeader) => {
//     authHeader = authorizationHeader;
//     if (authHeader === undefined) localStorage.removeItem(key);
//     else {
//       localStorage.setItem(key, authorizationHeader);
//       localStorage.setItem(key2, 'true');
//     }
//   },
//   getHeader: () => {
//     authHeader = authHeader || localStorage.getItem(key);
//     return authHeader;
//   }
// };
//
// let adminAuthHeader = undefined;
// const adminkey = '__admin_auth';
// const adminkey2 = '__is_admin_loggedIn';
//
// export const adminAuthorizer = {
//   setHeader: (authorizationHeader) => {
//     adminAuthHeader = authorizationHeader;
//     if (adminAuthHeader === undefined) localStorage.removeItem(adminkey);
//     else {
//       localStorage.setItem(adminkey, authorizationHeader);
//       localStorage.setItem(adminkey2, 'true');
//     }
//   },
//   getHeader: () => {
//     adminAuthHeader = adminAuthHeader || localStorage.getItem(adminkey);
//     return adminAuthHeader;
//   }
// };
//
// export const pushLogout = () => {
//   localStorage.removeItem('__auth');
//   localStorage.removeItem('__admin_auth');
//   localStorage.removeItem('__is_loggedIn');
//   localStorage.removeItem('__is_admin_loggedIn');
//   localStorage.removeItem('email');
//   localStorage.clear();
//   history.push('/');
//   notify.success('Not Authorized', 'Please login again !');
// };
//
// export const doLogout = () => {
//   localStorage.removeItem('__auth');
//   localStorage.removeItem('__is_loggedIn');
//   localStorage.removeItem('__admin_auth');
//   localStorage.removeItem('__is_admin_loggedIn');
//   localStorage.removeItem('email');
//   localStorage.clear();
//   history.push('/');
//   notify.success('Success', 'Successfully logged out!');
// };
//
// export let authorizationHeadr = localStorage.getItem("__auth");
// export let adminAuthorizationHeadr = localStorage.getItem("__admin_auth");
