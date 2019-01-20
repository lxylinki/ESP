<template>
	<div id="login">

		<div class="panel">
			<div class='login-texts'>
				
				<div class="loginheader">
					<div class="decor"></div>
					<div class="logintitle">用户登录</div>
					<img src="../../assets/esplogo.png" class="logo">
				</div>

				<div class="inputs">
					<div style="display: flex;">
						<div class="username-icon"><i class="iconfont">&#xe611;</i></div>
						<input class="longinput usrid" type="text" v-model="username" placeholder="请输入你的账户" v-on:keydown="invokeLogin($event)"></input>
					</div>
					
					<div style="height: 30px;"></div>

					<div style="display: flex;">
						<div class="password-icon"><i class="iconfont">&#xe61d;</i></div>
						<input class="longinput passwd" type="password" v-model="password" placeholder="请输入你的密码" v-on:keydown="invokeLogin($event)"></input>
					</div>

					<div style="height: 30px;"></div>					
				</div>



				<el-button class="loginbtn" v-on:click="login()">登陆</el-button>
			</div>			
		</div>
	
	</div>
</template>

<script type="text/javascript">

	import global_ from '../Global.js';
	//import {setCookie, getCookie} from '../../assets/js/cookie.js';
	import RSAKey from '../../assets/js/rsa.min.js'
	import Base from '../../assets/js/base64.js'

	export default {
		mounted(){
			/*
			if(getCookie('username')){
				this.$router.push('/managermanage');
			}*/
			//this.check_status();

		},

		data(){
			return {
				username:'',
				password:''
			}
		},

		methods:{
			invokeLogin(e) {
				if(e.keyCode == 13) {
					this.login();
				}
			},

			/*
			check_status(){
				var profile = global_.status_check;

				this.$http.post(profile, {}).then((resp)=>{
					if(resp.body.group == global_.student_group) {
						this.$router.push('/studentstats');
					} else {
						this.$router.push('/expmanage');
					}
					
				}, (err)=>{
					return;
				});
			},*/

			login(){
				let nonce, pk, ts, encrypt, epassword;

				if(this.username === '' || this.password === ''){
					layer.alert('请输入用户名和密码');

				} else {
					
					//var encryptapi = '/mengoo/index.php/site/pk';
					var encryptapi = global_.password_encrypt;

					this.$http.post(encryptapi, {}).then((encrypt_response)=>{

						nonce = encrypt_response.body.nonce;
						pk = encrypt_response.body.pk;
						ts = encrypt_response.body.ts;

						/*-----------------------------------------------------------------------------------*/
						let newEncrypter = new RSAKey();
						newEncrypter.setPublic(pk,"10001");
						epassword = Base.hex2b64(newEncrypter.encrypt(JSON.stringify([ts, nonce, this.password])));
						/*-----------------------------------------------------------------------------------*/
						let data = {
								'school_alias':'zy',
								'username': this.username, 
								'password': epassword,
								'remember': 0
						};
						
						//var api = '/mengoo/index.php/site/login';
						var api = global_.school_usr_login;

						//this.$http.post().then(success, failure);
						this.$http.post(api, data).then((resp)=>{
						
						//console.log(response);
						if(resp.body.group == global_.student_group) {
							this.$router.push('/studentstats');

						} else {
							this.$router.push('/expmanage');
						}

						}, (err)=>{
							layer.alert('登录失败');
							console.log(err);
						});		

					}, function(encrypt_err){
						console.log(encrypt_err);
					});
							
				}
			}
		}
	}
</script>

<style type="text/css" scoped>

input:focus {
	outline: none;
}

.iconfont {
	color: #ffffff;
	font-size: 20px;
}

.panel {
	position: fixed;
	display: flex;
	align-items: center;
	height: 100%;
	width: 100%;
	display: flex;
	background:  #20222d;
}

.login-texts {
	width: 400px;
	height: 400px;
	background: grey;
	margin: 0 auto;
	border-color: #ffffff;
	background:  #20222d;
	border: 1px solid #d7d7d7;
}


.logintitle, .logo {
	display: inline-block;
	margin-top: 10px;
}

.logo {
	width: 180px;
	margin-left: 110px;
}

.loginheader {
	display: flex;
	align-items: center;
}

.logintitle {
	font-size: 18px;
	text-align: center;
	color: #ffffff;
}
.decor {
	height: 20px;
	width: 8px;
	background: #5a98de;
	display: inline-block;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 10px;
}

.usrid, .passwd {
	background: #31313c;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	-webkit-border-top-right-radius: 5px;
	-webkit-border-bottom-right-radius: 5px;
	color: #ffffff;
	height: 30px !important;
	width: 250px !important;
	margin: 0;
}

/*overwrite default*/
input:-webkit-autofill {
		box-shadow: 0 0 0 1000px #31313c inset;
    -webkit-box-shadow: 0 0 0 1000px #31313c inset;
    -webkit-text-fill-color: #ffffff;
    caret-color: #ffffff;
    /*full coverage*/
    border: 5px solid #31313c !important;
}

/*
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    background-color: rgb(0, 0, 0) !important;
    background-image: none !important;
    color: rgb(0, 0, 0) !important;
    -webkit-tap-highlight-color:rgba(0,0,0,0) !important;
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
}*/

.inputs {
	position: relative;
	top: 5rem;
	margin-left: 50px;
}

.loginbtn{
	background: #5a98de;
	border: none;
	color: #ffffff;
	position: relative;
	left: 50px;
	top: 80px;
	width: 300px;
	height: 40px;
	border-radius: 5px;
}

.username-icon, .longinput, .password-icon {
	display: inline-block;
	vertical-align: top;
	margin: 0;
	padding-left: 0 !important;
	border: 5px solid #31313c !important;
}

.username-icon, .password-icon {
	width: 30px;
	height: 32px;
	background: #31313c;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	-webkit-border-top-left-radius: 5px;
	-webkit-border-bottom-left-radius: 5px;
}

.iconfont {
	position: relative;
	top: 5px;
	left: 5px;
	margin: 0;
}

</style>