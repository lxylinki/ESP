<template>
	<div id="teacheradd">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			教师管理
		</div>

		<div style="height: 40px;"></div>

		<div>
			<div class='texts'>
				<div> 用户名： 
					<input class="longinput" type="text" v-model="username">
					<!--<el-input class="usrenter" v-model="username" placeholder=""></el-input>-->
					<span class="redalert" v-show="!username">*</span>
					<span class="whitedefault"v-show="username">*</span>
					<!---->
				</div>
				<div style="height: 30px;"></div>
				<div> 密码： 
					<input class="longinput" type="password" v-model="password">
					<!--<el-input class="usrenter" v-model="password" placeholder=""></el-input>-->
					<span class="redalert" v-show="!password">*</span>
					<span class="whitedefault" v-show="password">*</span>
				</div>
				<div style="height: 30px;"></div>
				<div> 姓名： 
					<input class="longinput" type="text" v-model="realname">
					<!--<el-input class="usrenter" v-model="name" placeholder=""></el-input>-->
					<span class="redalert" v-show="!realname">*</span>
					<span class="whitedefault" v-show="realname">*</span>
				</div>
				<div style="height: 30px;"></div>
				<div class="genderdiv">
					<div class="gendertitle">性别:</div>
					<!--same v-model: same group-->
					<input id="male" v-model="gender" type="radio" checked="checked" value=1>男
					<input id="female" v-model="gender" type="radio" value=0 style="margin-left: 20px;">女
					<input id="emale" v-model="gender" type="radio" value=2 style="margin-left: 20px;">不限			
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
					<el-button class="confirm" v-on:click="addCreate()">确定</el-button>
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
				username: '',
				password: '',
				epassword:'',
				realname: '',
				status: 0,
				gender: 1,
				mod_name: 'teacher-manage'
			}
		},

		store: store,

		methods:{
			goBack(){
				this.$router.go(-1);
			},

			addCreate(){
				asyncReq.call(this);
				async function asyncReq(){
					this.epassword = await Utils.encrypt.call(this, this.password);

					var api = global_.teacher_create;
					let data = {
						'username': this.username,
						'password': this.epassword,
						'realname': this.realname,
						'gender': this.gender,
						'status': this.status
					}
					
					this.$http.post(api, data).then((resp)=>{
						Utils.lalert('添加教师成功');
						this.$store.commit('sign', this.mod_name);
						this.$store.commit('incRowNumAfter', 1);
						this.$router.go(-1);
					}, (err)=>{
						Utils.lalert('添加教师失败');
						console.log(err);
					});
				}				
			}
		}
	}
</script>


<style type="text/css" scoped>


.texts {
	width: 420px;
	height: 300px;
	text-align: right;
}

.texts .btn-group {
	float: left;
	margin-left: 103px;
}


.redalert {
	color: red;
}
.whitedefault {
	/*must be the same with bg color*/
	color: #ffffff;
}

.statusdiv {
	display: flex;
}

.statustitle {
	margin-left: 60px;
	margin-right: 10px;
}

.genderdiv {
	display: flex;
}

.gendertitle {
	margin-left: 60px;
	margin-right: 8px;
}

.goback, .goback:hover, .goback:active, .goback:focus{
	color: white;
	background: #d2d5d2;
	border-color: #d2d5d2;
}

.confirm, .confirm:hover, .confirm:active, .confirm:focus{
	background: #31313c;
  	color: white;
  	border-color: #31313c;
}

</style>