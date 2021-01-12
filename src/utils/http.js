import axios from 'axios'
import qs from 'qs'
import { Message } from 'view-design';


const http = axios
// http.get("serverconfig.json").then((result) => {
//     //用一个全局字段保存ApiUrl  也可以用sessionStorage存储
//     http.defaults.baseURL = result.data.ApiUrl;
// }).catch((error) => {
//     http.defaults.baseURL = ip
// });

// request 拦截器
// http.interceptors.request.use(
//     config => {
//         if (store.getters.userInfo.token) {
//             config.headers['token'] = getToken()
//         }
//         return config
//     },
//     error => {
//         return Promise.reject(error)
//     }
// )
http.apiGet = function(url, data) {
    return new Promise((resolve, reject) => {
      axios.get(url, data).then((response) => {
        resolve(response.data);
      }, (response) => {
        reject(response);
        timeoutMsg();
      });
    });
  }
  http.apiPost = function(url, data, config) {
    return new Promise((resolve, reject) => {
      data = qs.stringify(data);
      axios.post(url, data, config).then((response) => {
        resolve(response.data);
      }).catch((response) => {
        // console.log(response);
        resolve(response);
        timeoutMsg();
      });
    });
  }
  http.handleError = function(res) {
    if (res.message != null && res.message != 'Network Error') {
      Message.warning(res.message)
    }
  }

// respone 拦截器
http.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response)
        } else {
            // tools.notify({
            //     type: 'error',
            //     message: '用户名或密码错误',
            //     duration: 5000
            // })
            return Promise.reject(response)
        }
    },
    error => {
        // tools.notify({
        //     type: 'error',
        //     message: '用户名或密码错误',
        //     duration: 5000
        // })
        return Promise.reject(error)
    }
)

export default http