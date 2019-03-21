<template>
	<div id="studentadd">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			学生管理
		</div>

		<div style="height: 40px;"></div>

		<div>
			<div class='texts'>
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
				<div> 主班级： 
					<template>
					  <el-select class="longselect"
					  			 v-model="class_value" 
					  			 placeholder="请搜索班级名称"
					  			 filterable>
					    <el-option
					      v-for="item in class_options"
					      :key="item.id"
					      :label="item.class_name"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</template>

					<span class="redalert" v-show="!class_value">*</span>
					<span class="whitedefault" v-show="class_value">*</span>
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
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	export default {
		data(){
			return {
				username: '',
				password: '',
				epassword: '',
				realname: '',
				gender: 1,
				status: 0,
				class_value: '',
				class_options: []
			}
		},
		methods:{
			goBack(){
				this.$router.go(-1);
			},

			//teacher name, class name
			reqClassData(tkeyword, ckeyword, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqClassList.call(this, tkeyword, ckeyword, page);
	     			this.class_options = resp.body._list;					
				}
			},

			preCheck(){
				if(!this.username) {
					Utils.lalert('请输入用户名');
					return;

				} else if(!this.password) {
					Utils.lalert('请输入密码');
					return;

				} else if(this.password && this.password.split('').length<6) {
					Utils.lalert('密码长度不得小于6位');
					return;

				} else if(!this.realname) {
					Utils.lalert('请输入真实姓名');
					return;

				} else if(!this.class_value){
					Utils.lalert('请选择班级');
					return;
					
				} else {
					this.addCreate();
				}
			},

			addCreate(){
				asyncReq.call(this);
				async function asyncReq(){
					this.epassword = await Utils.encrypt.call(this, this.password);
					let api = global_.student_create;
					let data = {
						'class_id': this.class_value,
						'username': this.username,
						'password': this.epassword,
						'realname': this.realname,
						'gender': this.gender,
						'status': this.status
					}
					this.$http.post(api, data).then((resp)=>{
						Utils.lalert('添加学生成功');
						//this.$store.commit('incRowNumAfter', 1);
						this.$router.go(-1);
					},(err)=>{
						Utils.err_process.call(this, err, '创建学生失败');
					});
				}

			}
		},
		mounted(){
			Utils.page_check_status.call(this);
			this.reqClassData('', '', 1);
		}
	}
</script>


<style type="text/css" scoped>
.longselect /deep/ .el-input__inner {
	height: 34px;
	width: 300px;
	border-radius: 0;
}

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

.genderdiv {
	display: flex;
}

.gendertitle {
	margin-left: 60px;
	margin-right: 8px;
}


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
</style>