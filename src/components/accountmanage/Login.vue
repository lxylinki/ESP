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
	import Utils from '../Utils.js';

	export default {
		mounted(){
			Utils.login_check_status.call(this);
			document.querySelector('.usrid').focus();
		},

		data(){
			return {
				username:'',
				password:'',
				epassword:''
			}
		},

		methods:{
			invokeLogin(e) {
				if(e.keyCode == 13) {
					this.login();
				}
			},

			login(){
				asyncReq.call(this);
				async function asyncReq(){
					this.epassword = await Utils.encrypt.call(this, this.password);
					var api = global_.school_usr_login;

					let data = {
							'school_alias':'zy',
							'username': this.username, 
							'password': this.epassword,
							'remember': 0
					};
					
					this.$http.post(api, data).then((resp)=>{
						if(resp.body.group == global_.student_group) {
							this.$router.push('/studentstats');

						} else {
							this.$router.push('/expmanage');
						}
						
					}, (err)=>{
						Utils.err_process.call(this, err, '登陆失败');
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