<template>
	<div id="manageredit">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			管理员管理
		</div>

		<div style="height: 40px;"></div>

		<div>
			<div class='texts'>
				<div> 用户名： 
					<input class="longinput" type="text" v-model="username" disabled="true">
					<!--<el-input class="usrenter" v-model="usrid" placeholder=""></el-input>-->
					<span class="redalert" v-show="!username">*</span>
					<span class="whitedefault"v-show="username">*</span>
					<!---->
				</div>
				<div style="height: 30px;"></div>
				<div> 密码： 
					<input class="longinput" type="password" v-model="password">
					<!--<el-input class="usrenter" v-model="password" placeholder=""></el-input>-->
					<!--<span class="redalert" v-show="!password">*</span>-->
					<span class="whitedefault">*</span>
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
	import store from '@/vuex/store.js';
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	
	export default {
		store: store,
		data(){
			return {
				user_id: '',
				password: '',
				realname: '',
				status: 0,
				username: '',
				//epassword: '',
				gender: null
			}
		},

		methods:{
			goBack(){
				this.$router.go(-1);
			},

			preCheck(){
				if(!this.realname) {
					Utils.lalert('请输入真实姓名');
					return;

				} else if(this.password && this.password.split().length<6){
					Utils.lalert('密码长度不得小于6位');
					return;

				} else {
					this.saveEdit();
				}
			},

			saveEdit(){
				asyncReq.call(this);
				async function asyncReq(){
					var api = global_.manager_update;
					let data = {
						'user_id': this.user_id,
						'realname': this.realname,
						'username': this.username,
						//'password': this.epassword,
						'status': this.status,
						'gender': this.gender
					}

					if(this.password) {
						data.password = await Utils.encrypt.call(this, this.password);
					}

					this.$http.post(api, data).then((resp)=>{
						Utils.lalert('编辑管理员成功');
						this.$router.go(-1);
						
					},(err)=>{
						Utils.err_process.call(this, err, '编辑管理员失败')
					});
				}
			}
		},

		mounted(){
			Utils.page_check_status.call(this);

			var edit = this.$store.state.edit;			
			if(!edit) {
				this.$router.go(-1);

			} else {
				var row = this.$store.state.row;
				//console.log(row);
				this.user_id = row.user_id;
				this.username = row.username;
				this.realname = row.realname;
				this.status = row.status;
				this.gender = row.gender;				
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
	/*same with bg color*/
	color: #f7f7f7;
}

.genderdiv {
	display: flex;
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
}

.statustitle {
	margin-left: 60px;
	margin-right: 10px;
}
.male, .female {
	margin-right: 20px;
}
</style>