<template>
	<div id="manageradd">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			管理员管理
		</div>

		<div style="height: 20px;"></div>

		<div>
			<div class='texts'>
				<!--
				<div> 学校名称： 
					<input class="longinput" type="text" v-model="schname">
					<span class="redalert" v-show="!schname">*</span>
					<span class="whitedefault"v-show="schname">*</span>
				</div>
				<div style="height: 30px;"></div>-->
				<div> 用户名： 
					<input class="longinput" type="text" v-model="username">
					<span class="redalert" v-show="!username">*</span>
					<span class="whitedefault"v-show="username">*</span>
					<!---->
				</div>
				<div style="height: 30px;"></div>
				<div> 密码： 
					<input class="longinput" type="password" v-model="password">
					<span class="redalert" v-show="password.split('').length<6">*</span>
					<span class="whitedefault" v-show="password.split('').length>=6">*</span>
				</div>
				<div style="height: 30px;"></div>
				<div> 姓名： 
					<input class="longinput" type="text" v-model="realname">
					<span class="redalert" v-show="!realname">*</span>
					<span class="whitedefault" v-show="realname">*</span>
				</div>
				<div style="height: 30px;"></div>
				<div class="genderdiv">
					<div class="gendertitle">性别:</div>
					<!--same v-model: same group-->
					<input id="male" v-model="gender" type="radio" checked="checked" value=1><label class="male" for="male">男</label>
					<input id="female" v-model="gender" type="radio" value=0><label class="female" for="female">女</label>
					<input id="emale" v-model="gender" type="radio" value=2><label class="emale" for="emale">不限</label>			
				</div>

				<div style="height: 30px;"></div>

				<div class="statusdiv">
					<div class="statustitle">状态:</div>
					<el-switch class="switch"
					  v-model="status"
					  active-value=1
					  inactive-value=0
					  active-text="启用">
					</el-switch>					
				</div>
				<div style="height: 30px;"></div>
				<div class="btn-group">
					<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
					<el-button class="goback" v-on:click="goBack()">返回</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import global_ from '../../Global.js';
	import Utils from '../../Utils.js';
	import store from '@/vuex/store.js';

	export default {
		data(){
			return {
				//schname: '',
				username: '',
				password: '',
				realname: '',
				epassword: '',
				status: 0,
				gender: 1,
				mod_name: 'manager-manage'
			}
		},
		store: store,
		methods:{
			goBack(){
				this.$router.go(-1);
			},

			preCheck(){
				if(!this.username) {
					Utils.lalert('请输入用户名');
					return;

				} else if(!this.password) {
					Utils.lalert('请输入密码');
					return;

				} else if (this.password && this.password.split('').length<6){
					Utils.lalert('密码长度不得小于6位');
					return;
					
				} else if(!this.realname) {
					Utils.lalert('请输入真实姓名');
					return;
					
				} else {
					this.addCreate();
				}
			},

			addCreate(){
				asyncReq.call(this);
				async function asyncReq(){
					this.epassword = await Utils.encrypt.call(this, this.password);
					var api = global_.manager_create;
					let data = {
						'username': this.username,
						'password': this.epassword,
						'realname': this.realname,
						'status': this.status,
						'gender': this.gender
					}

					this.$http.post(api, data).then((resp)=>{
						Utils.lalert('添加校管理员成功');
						// this.$store.commit('sign', this.mod_name);
						// this.$store.commit('incRowNumAfter', 1);
						this.$router.go(-1);

					}, (err)=>{
						Utils.err_process.call(this, err, '添加校管理员失败');
					});
				}
			}
		},

		mounted(){
			Utils.page_check_status.call(this);
		}
	}
</script>



<style type="text/css" scoped>
.texts {
	width: 430px;
	height: 300px;
	text-align: right;
}

.texts .btn-group {
	float: left;
	margin-left: 114px;
}

.redalert {
	color: red;
}
.whitedefault {
	/*same with bg color*/
	color: #ffffff;
}

.genderdiv {
	display: flex;
	margin-left: 10px;
}

.gendertitle {
	margin-left: 60px;
	margin-right: 8px;
}

/*
.goback, .goback:hover, .goback:active, .goback:focus{
	color: white;
	background: #d2d5d2;
	border-color: #d2d5d2;
}

.confirm, .confirm:hover, .confirm:active, .confirm:focus{
	background: #31313c;
  	color: white;
  	border-color: #31313c;
}*/

.statusdiv {
	display: flex;
	margin-left: 10px;
}

.statustitle {
	margin-left: 60px;
	margin-right: 10px;
}
.male, .female {
	margin-right: 20px;
}
</style>