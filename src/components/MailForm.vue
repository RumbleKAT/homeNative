<template>
 <h1>청약 알람 리스트</h1>
 <div class="mail_list">
 <ul>
    <li v-for="favorite in favorites" :key="favorite.HOUSE_MANAGE_NO">
        <mailElement :favorite="favorite" />
    </li>
 </ul>
 </div>
  <div class="container" style="background-color:white">
    <!-- <input type="text" placeholder="Email address" name="mail" v-model="subscribe" required> -->
  </div>
    <div class="footer">
    <h2>알람 신청하기</h2>
      <div class="container">
        {{this.subscribe}}
        <GoogleAuth @updateEmail="updateEmail" />
        <template v-if="this.subscribe != ''">
          <div class="sub_container">
            <input type="checkbox" v-model="checked"/>
            (필수)
            <a href="https://ionian-fright-fbe.notion.site/5615c3b5749a42d2914d482bbebe452b">개인정보 수집 및 이용</a>
            에 동의합니다.
          </div>
          <div class="sub_container">
            <button @click="setSubscribe">Subscribe</button>   
          </div>
        </template>
        <div class="sub_container">
          <p>Contact. rumblekat0318@gmail.com 
            <br/>ⓒ 2022. Rumblekat all rights reserved.</p>
        </div>
      </div>
    </div>
</template>

<script >
import mailElement from './MailElement.vue';
import GoogleAuth from './GoogleLogin.vue';

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export default {
    data : function(){
        return{
            email : '',
            subscribe : '',
            isLogin : false
        }
    },
    components: {
        mailElement,
        GoogleAuth
    },
    computed : {
        count(){
            return this.$store.state.count;
        },
        response(){
            return this.$store.state.response;
        },
        favorites(){
            return this.$store.state.favorite;
        }
    },
    mounted(){
      this.subscribe = this.$store.state.subscribe;
    },
    methods:{
        updateEmail(param){
          // console.log(param);
          this.subscribe = param;
        },
        setSubscribe(){
            if(!this.checked){
              alert('약관에 동의하지 않을시 알람을 받을 수 없습니다.');
              return;
            }
            
            if(!validateEmail(this.subscribe)){
                alert(`유효하지 않은 메일 주소입니다.`);                
                return;
            }
            alert(`${this.subscribe}로 청약 알람 메일을 보내드립니다.`);
            this.$store.dispatch('setSubscribe',{
                data: this.subscribe
            });
        }
    }
}
</script>

<style>
ul{
    list-style: none;
    text-align: center;
    padding-inline-start : 0px;
}
.mail_list{
  overflow:auto;
  min-height:27em; 
  max-height:40em;
}
.container {
  padding: 20px;
}
.footer{
  width:100%;
  bottom:0;
  /* position: absolute; */
  background-color: #f1f1f1;
  overflow: hidden;
}
.footer h2{
  margin :0;
  padding: 0.5em;
}

/* Style the input elements and the submit button */
input[type=text]{
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

/* Style the submit button */
.container button {
  background-color: #04AA6D;
  color: white;
  border: none;
  padding: 1em 1.5em;
  font-size: 16px; 
  border-radius: 8px;
  /* margin-top : 1em; */
}

.container button:hover {
  opacity: 0.8;
}

  .sub_container{
    width : 100%;

  }
  .sub_container button{
    height : 3em;
    
  }
  .sub_container a{
    text-decoration: none;
    color: #222;
  }

</style>
