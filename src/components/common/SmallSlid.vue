<template>
    <div class="smallSlid">
        <Drawer title="" style="width:200px;padding:0" width="200" placement="left" :closable="false" v-model="value">
            <template slot="heider"></template>
            <Slid @mouseleave.native="value=false"/>
        </Drawer>
        <div class="menuAction" @click="value=true" @mouseenter="value=true">
            <Slid :hidden="true"/>
        </div>
    </div>
</template>
<script>
import Slid from './Slid'
import { Drawer } from 'view-design';
export default {
    components:{ Slid,Drawer },
    data(){
        return{
            value:false
        }
    },
    watch:{
        $route(){
            this.value = false
        }
    }
}
</script>
<style>
    .smallSlid{
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        z-index: 5;
    }
    .ivu-drawer-body{
        padding:0 !important;
    }
    .menuAction{
        height: 100%;
    /* background: #074444; */
    position: relative;
    width: 42px;
    overflow: hidden;
    }
    .menuAction> i{
        position: absolute;
    font-size: 60px;
    top: calc(50% - 30px);
    left: -23px;
    }
</style>