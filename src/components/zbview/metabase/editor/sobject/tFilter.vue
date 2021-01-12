<template>
    <div style="height:100%">
        <div style="height:calc(100% - 42px);overflow:auto;padding:0 5px;">
            <div v-show="type==1">
                <h3>过滤条件</h3>
                <p v-for="(item,index) in filter" :key="index" class="zhibiaohover" style="background:#7172AD;color:#fff;margin:3px 0;">
                    <!-- <chartSvg :type="item.dataType"></chartSvg> -->
                    &nbsp;<span style="color:#fff;display:inline-block;width:calc(100% - 25px);vertical-align: sub;">{{filterLabel[index]}}</span>
                    <Icon class="colse" type="md-close" @click="removeFilter(index)" style="font-size:18px;float:right"/>
                </p>
                <Divider />
                <h3>筛选条件</h3>
                <p v-for="(item,index) in data" :key="index" class="zhibiaohover" @click="selectItem(item)">
                    <chartSvg :type="item.dataType"></chartSvg>
                    &nbsp;<span>{{item.title}}</span>
                </p>
            </div>
            <div v-show="type==2">
                <h3>
                    <a @click="type=1">
                    <Icon type="ios-arrow-back" />&nbsp;&nbsp;{{checkedItem.title}}
                    </a>
                </h3>
                <div v-if="checkedItem.dataType.toLowerCase()=='string'" style="padding:5px;">
                <!-- <div v-if="checkedItem.dataType=='STRING'"> -->
                    <Select v-model="filterType" style="width:100%;margin-bottom:10px">
                        <Option v-for="item in [
                            {label:'是',type:1},
                            {label:'不是',type:2},
                            {label:'包含',type:3},
                            {label:'不包含',type:4},
                            {label:'为空',type:5},
                            {label:'不为空',type:6},
                            {label:'以...开始',type:7},
                            {label:'以...结束',type:8}
                        ]" :value="item.type" :key="item.type">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="filterValue" v-if="filterType!=5&&filterType!=6"  placeholder="过滤值" style="width: 100%" />
                </div>
                <div v-if="checkedItem.dataType.toLowerCase()=='number'" style="padding:5px;">
                <!-- <div v-if="checkedItem.dataType=='STRING'"> -->
                    <Select v-model="filterType" style="width:100%;margin-bottom:10px">
                        <Option v-for="item in [
                            {label:'是',type:1},
                            {label:'不是',type:2},
                            {label:'大于',type:9},
                            {label:'小于',type:10},
                            {label:'介于之间',type:11},
                            {label:'大于或等于',type:12},
                            {label:'小于或等于',type:13},
                            {label:'为空',type:5},
                            {label:'不为空',type:6}
                        ]" :value="item.type" :key="item.type">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="filterValue" v-if="filterType!=5&&filterType!=6"  placeholder="过滤值" style="width: 100%" />
                </div>
                <div v-if="checkedItem.dataType.toLowerCase()=='date'" style="padding:5px;">
                <!-- <div v-if="checkedItem.dataType=='STRING'"> -->
                    <Select v-model="filterType" style="width:100%;margin-bottom:10px">
                        <Option v-for="item in [
                            {label:'介于之间',type:11},
                            {label:'晚于',type:12},
                            {label:'早于',type:13},
                            {label:'前',type:14},
                            {label:'后',type:15},
                            {label:'当前',type:16},
                            {label:'为空',type:5},
                            {label:'不为空',type:6}
                        ]" :value="item.type" :key="item.type">{{ item.label }}</Option>
                    </Select>

                    <!-- <Input v-model="filterValue[0]"  placeholder="开始时间" type="date" style="width: 100%" />
                    <Input v-model="filterValue[1]"  placeholder="结束时间" type="date" style="width: 100%" /> -->
                        <DatePicker v-if="filterType==11" v-model="filterValue" format="yyyy-MM-dd hh:mm:ss" type="datetimerange" size="small" placeholder="Select time"></DatePicker>
                        <template v-if="filterType==12||filterType==13">
                            <DatePicker v-model="filterValue" format="yyyy-MM-dd hh:mm:ss" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
                        </template>
                    <InputNumber v-if="filterType==14||filterType==15" :min="1" v-model="filterDateValue"></InputNumber>
                    <Select v-if="filterType==14||filterType==15||filterType==16" v-model="filterType2" style="width:100%;margin-bottom:10px">
                        <Option v-for="item in [
                            {label:'天',type:'day'},
                            {label:'周',type:'week'},
                            {label:'月',type:'month'},
                            {label:'年',type:'year'},
                            {label:'分',type:'minute'},
                            {label:'时',type:'hour'}
                        ]" :value="item.type" :key="item.type">{{ item.label }}</Option>
                    </Select>
                </div>

            </div>
        </div>
        <div style="text-align:center">
            <Button v-if="canSave" @click="addFilter" style="background:#7172AD;color:#fff;vertical-align:text-top;border-radius:5px;">添加过滤器</Button>
            <Button v-else @click="$emit('update:showGl',false)" style="background:#7172AD;color:#fff;vertical-align:text-top;border-radius:5px;">取消</Button>
        </div>
    </div>
</template>
<script>
import {chartSvg} from '@/components/index.js'
export default {
    props:['data','showGl','aggregation','groupBy'],
    components:{chartSvg},
    data(){
        return{
            type:1,
            checkedItem:{dataType:''},
            filterType:'',
            filterType2:'day',
            filterValue:'',
            timeValue:[],
            filter:[],
            filterLabel:[],
            filterDateValue:30
        }
    },
    computed:{
        canSave(){
            if(this.type==2){
                if(this.filterType==5||this.filterType==6){
                    return true
                }else if(this.filterType==14||this.filterType==15||this.filterType==16){
                    if(this.filterType2){
                        if(this.filterDateValue) return true
                        else return false
                    }else{
                        return false
                    }
                }else{
                    if(typeof this.filterValue == 'object'){
                        if(this.filterType==11){
                            if((this.filterValue[0]&&this.filterValue[1])){
                                return true
                            }else{
                                return false
                            }
                        }else{
                            if(this.filterValue) return true
                            else return false
                        }
                    }else{
                        if(this.filterType&&this.filterValue!==''){
                            return true
                        }else{
                            return false
                        }
                    }
                }
            }else{
                return false
            }
        }
    },
    methods:{
        selectItem(item){
            this.type = 2
            this.checkedItem = item
            this.filterValue = ''
            if(this.checkedItem.dataType=='DATE') this.filterType = 11
            else this.filterType = 1
        },
        formartDate(date){
            // console.log(typeof date)
            if(date){
                let sdate = new Date(date)
                // console.log(sdate)
                let year = sdate.getFullYear()
                let month = sdate.getMonth() + 1
                if(month<10) month = '0'+month
                let date = sdate.getDay()
                if(date<10) date = '0'+date
                let hours = sdate.getHours()
                if(hours<10) hours = '0'+hours
                let minutes = sdate.getMinutes()
                if(minutes<10) minutes = '0'+minutes
                let seconds = sdate.getSeconds()
                if(seconds<10) seconds = '0'+seconds
                return year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds
            }else{
                return ''
            }
        },
        addFilter(){
            let data=[
                {label:'是',type:1},
                {label:'不是',type:2},
                {label:'包含',type:3},
                {label:'不包含',type:4},
                {label:'为空',type:5},
                {label:'不为空',type:6},
                {label:'以...开始',type:7},
                {label:'以...结束',type:8},
                {label:'大于',type:9},
                {label:'小于',type:10},
                {label:'介于之间',type:11},
                {label:'大于或等于',type:12},
                {label:'小于或等于',type:13},
                {label:'前',type:14},
                {label:'后',type:15},
                {label:'当前',type:16},
            ]
            let label=''
            for(let a of data){
                if(a.type==this.filterType){
                    label = a.label
                }
            }
            let label2 = this.filterValue
            console.log(this.filterValue)
            let filterValue = this.filterValue
            if(this.checkedItem.dataType=='DATE'){
                if(this.filterType==12) label = '晚于'
                else if(this.filterType==13) label = '早于'
                label2 = ''
                if(this.filterType==11){
                    label2 += this.filterValue[0].format('yyyy-MM-dd hh:mm:ss')
                    label2 += ' 至 '+this.filterValue[1].format('yyyy-MM-dd hh:mm:ss')
                    filterValue = this.filterValue[0].format('yyyy-MM-dd hh:mm:ss')+','+this.filterValue[1].format('yyyy-MM-dd hh:mm:ss')
                }else if(this.filterType==12||this.filterType==13){
                    label2 += this.filterValue.format('yyyy-MM-dd hh:mm:ss')
                    filterValue = this.filterValue.format('yyyy-MM-dd hh:mm:ss')
                }else if(this.filterType==14||this.filterType==15){
                    label2 = this.filterDateValue+' '+this.filterType2
                    filterValue = this.filterDateValue+' '+this.filterType2
                }else if(this.filterType==16){
                    label2 = this.filterType2
                    filterValue = this.filterType2
                }
            }
            this.filter.push({
                type:this.filterType,
                column:this.checkedItem.key,
                value:filterValue
            })
            this.filterLabel.push(this.checkedItem.key+' '+label+' '+label2)
            this.type=1
            this.$emit('reflashGetObject',this.filter,this.aggregation,this.groupBy)
        },
        removeFilter(index){
            this.filter.splice(index,1)
            this.filterLabel.splice(index,1)
            this.$emit('reflashGetObject',this.filter,this.aggregation,this.groupBy)
        }
    },
    watch:{
        filterValue(){
            // console.log(this.filterValue)
            // console.log(this.filterValue[0])
            if(this.checkedItem.dataType=='DATETIME'){
                this.timeValue[0] = this.formartDate(this.filterValue[0])
                this.timeValue[1] = this.formartDate(this.filterValue[1])
            }
        }
    }
}
</script>
<style scoped>
.zhibiaohover:hover{
  background:#7172AD;
  color:#fff;
}
h3{
    padding: 6px 0;
    border-bottom: 1px solid #ddd;
}
</style>