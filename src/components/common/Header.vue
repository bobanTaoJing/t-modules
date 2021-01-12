<template>
    <div class="header">
        <div style="width:200px;float:left;position:relative;height:60px;overflow:hidden">
            <img src="../../../public/img/logo.png" 
                style="width:160px;position:absolute;top: -16px;left: 16px;" alt="">
            <!-- <div style="position:absolute;top:0;right:0">国家电网
                <br>甘肃省电力
            </div> -->
        </div>
        <h3 class="header-title">{{config.title}}</h3>
        <div style="float:right;margin-right:25px;">
             <span class="time media-type-big" style="display:inline-block">{{time}}</span>
            <Dropdown trigger="click" style="margin-left: 20px">
                <a href="javascript:void(0)">
                    <span>{{name}}</span>
                    <Icon class="user" type="md-contact" />
                </a>
                <DropdownMenu slot="list" placement="bottom-start">
                    <DropdownItem @click.native="logout">退出登录</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>
<script>
import {DropdownMenu,Dropdown,DropdownItem} from 'view-design'
import config from '../../assets/config'
export default {
    data(){
        return{
            config,
            theme1:'light',
            time:''
        }
    },
    components:{DropdownMenu,Dropdown,DropdownItem},
    computed:{
        name(){
            return this.$store.getters.userInfo.name
        }
    },
    created(){
        this.time = new Date().toLocaleString()
        setInterval(()=>{
            this.time = new Date().toLocaleString()
        },1000)
    },
    methods:{
        logout(){
            sessionStorage.clear()
            this.$store.dispatch('setMenu', {menu:[]});
            this.$store.dispatch('setPmenu', {pmenu:[]});
            this.$store.dispatch('setRname', '');
            this.$router.push('/login')
        }
    }
}
</script>
<style>
    .header .user{
        line-height: 60px;
    }
    .header-title{
        float:left;font-size: 30px;
        line-height: 54px;
        text-shadow: 1px 1px 1px #ddd;
    }
</style>