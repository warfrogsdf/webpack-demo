<template>
    <div>
        <div v-if="msg">加载中1</div>

        <router-view v-if="!msg"></router-view>
    </div>
</template>
<script>
    export default{
        data() {
            return {
                msg: false,
            }
        },
        components: {

        },
        created(){
            setTimeout(()=>{
                    this.msg = false
            }, 2000)
        }

    }
</script>