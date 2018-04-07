import axios from 'axios'

const apiUrl = "../parkingpay.ashx?"

axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (res) {
  return res;
}, function (error) {
  return Promise.reject(error);
})

export const postApi = (data, succ_foo, error_foo) => {
  let datastr = ''
  for (let it in data) {
    datastr += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  axios({
      method: "get",
      url: apiUrl + datastr,
    }).then(response => {
      succ_foo(response)
    })
    .catch(error => {
      error_foo(error)
    })
}
