

export function debounce(func, wait = 1000, immediate = true) {
    let timeout
    let result
    return function(...args) {
        const context = this
        if (timeout) window.clearTimeout(timeout)
        if (immediate) {
            let callNow = !timeout
            timeout = setTimeout(() => {
                timeout = false
            }, wait)
            if (callNow) result = func.apply(context, args)
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait)
        }
        return result
    }
}

export const randomIntegerInRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

export const deepCopyData = (data)=>{
            if(data&&typeof data === 'object'){
                let arr
                if(data.length||data.length===0){
                    arr = []
                    for(let i=0;i<data.length;i++){
                        let a = deepCopyData(data[i])
                        arr.push(a)
                    }
                }else{
                    arr = {}
                    for(let i in data){
                        let a = deepCopyData(data[i])
                        arr[i] = a
                    }
                }
                return arr
            }else{
                return data
            }
        }
    
//内容过长时 省略显示
export let splitString=function(temp,max){
    if(temp){
        let reg=/^[\u4e00-\u9fa5]+$/,length=0,title=''
        let tempArr = temp.split('')
        for(let a of tempArr){
            if(reg.test(a)) length+=2
            else length++
            if(length<=max) title+=a
            else{
                title+='...'
                return title
            }
        }
        return title
    }else
        return temp
}
//深度拷贝
export let deepCopy=function(data,ignore){
    if(data&&typeof data =='object'){
        let arr
        if(data  instanceof Array){
             arr=[]
             for(let a of data){
                if(typeof a =='object'){
                    arr.push(deepCopy(a,ignore))
                }else{
                    arr.push(a)
                }
            }
        }
        else{
            arr={}
            for(let i in data){
                let a = data[i]
                if(i==ignore){
                    arr[i]=a
                }else{
                    if(typeof a =='object'){
                        arr[i]=deepCopy(a,ignore)
                    }else{
                        arr[i]=a
                    }
                }
            }
        }
        
        // for(let i in data){
        //     let a = data[i]
        //     if(typeof a =='object'){
        //         arr[i]=deepCopy(a)
        //     }else{
        //         arr[i]=a
        //     }
        // }
        return arr

    }else{
        return data
    }
}
