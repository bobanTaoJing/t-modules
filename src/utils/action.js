import http from '../utils/http'
import * as tools from '../utils/tools'
//处理点击事件
export function _action(data) {
    //调用接口
    if(data.type==1){
        if(data.httpType=='get')
            http.get(data.url,{
                params:data.data
            }).then(res=>{
                if(res.status==200&&res.code==1)
                    tools.notify({
                        type: 'success',
                        message: res.msg,
                        duration: 2000
                    })
                else
                    tools.notify({
                        type: 'error',
                        message: res.data.msg,
                        duration: 2000
                    })
            })
    //跳到新页面
    }else if(data.type==2){
        
    }
}