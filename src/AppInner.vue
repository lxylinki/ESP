<template>
	<div id='app'>
		<div class='navigation'>

			<el-container>
				<el-header style="background: #20222d; height: 100px; overflow: hidden;">
					<img src="./assets/esplogo.png" class="logo">
					
					<div class="welcometext" v-show="isAdmin">{{hellotext}}： 管理员</div>
					<div class="welcometext" v-show="isTeacher">{{hellotext}}： 老师</div>
					<div class="welcometext" v-show="isStudent">{{hellotext}}： 同学</div>

					<div class='ctrl'>
						<div class="setting">
							<!--<i class="el-icon-setting" style="color: white"></i>-->
							<i class="iconfont" style="color: white">&#xe606;</i>
							<!--<el-button type="primary" icon="el-icon-search">搜索</el-button>-->
							<el-button type="text" style="color: white;" v-on:click="goPersonal()">设置</el-button>
						</div>
						<div class="logoff">
							<!--<i class="el-icon-delete" style="color: white;"></i>-->
							<i class="iconfont" style="color: white;">&#xe62e;</i>
							<el-button type="text" style="color: white" v-on:click="quit()">退出</el-button>
						</div>
					</div>
				</el-header>


				<el-container>
        			<el-aside width="240px">
        				<!--<div style="height: 110px; background: #31313c"></div>-->
        				<Nav v-bind:menuList='menuList'
        				     v-bind:curGroup='current_group'></Nav>
        				<div class="navbg"></div>
        			</el-aside>
        
        			<el-main>
        				<!--main content area-->
        				<router-view></router-view>
        			</el-main>
      			</el-container>

			</el-container>

		</div>


	</div>
</template>


<script type="text/javascript">
	import Nav from './components/Nav.vue';
	import global_ from './components/Global.js';
	import store from '@/vuex/store.js';
	//import { setCookie, getCookie, delCookie } from './assets/js/cookie.js';
	
	export default {
		components:{
			'Nav': Nav
		},
		store: store,
		data(){
			return {
				hellotext: '',
				menuList:[
					{
	            		name:'账户管理',
	            		//url: "/accmanage",
	            		url: "",
	            		isSubShow: false,
	            		//show to these users only
	            		userGroup: [
	            			global_.school_admin_group,
	            			global_.teacher_group
	            		],
	            		subItems:[
	            			{
	            				name: '校管理员',
	            				url: "/managermanage",
	            				userGroup: [global_.school_admin_group],
	            				isSubShow: false,
	            				subItems: []
	            			},

	            			{
	            				name: '教师管理',
	            				url: "/teachermanage",
	            				userGroup: [global_.school_admin_group],
	            				isSubShow: false,
	            				subItems: []
	            			},

	            			{
	            				name: '学生管理',
	            				url: "/studentmanage",
	            				userGroup: [
	            					global_.school_admin_group,
	            					global_.teacher_group
	            				],
	            				isSubShow: false,
	            				subItems: []
	            			},

		            		{
			            		name:'班级管理',
			            		url: "/classmanage",
			            		userGroup: [
			            			global_.school_admin_group, 
			            			global_.teacher_group
			            		],
			            		isSubShow:false,
			            		subItems:[]          			
		            		}
	            		]
            		}, 

            		{
	            		name:'实验管理',
	            		url: "/expmanage",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group
	            		],
	            		isSubShow:false,
	            		subItems:[]            		            			
            		},
            		{
	            		name:'考核管理',
	            		url: "/exammanage",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group
	            		],
	            		isSubShow:false,
	            		subItems:[]            		            			
            		},

            		{
	            		name:'试题管理',
	            		url: "/questionmanage",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group
	            		],
	            		isSubShow:false,
	            		subItems:[]            		            			
            		},
             		{
	            		name:'成绩统计',
	            		url: "/studentstats",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group,
	            			global_.student_group
	            		],
	            		isSubShow:false,
	            		subItems:[]            		            			
            		},
             		{
	            		name:'实验报告',
	            		url: "/reportmanage",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group,
	            			global_.student_group
	            		],
	            		isSubShow:false,
	            		subItems:[]            		            			
            		},
             		{
	            		name:'版本更新',
	            		url: "/updatenote",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group,
	            			global_.student_group
	            		],
	            		isSubShow:false,
	            		subItems:[]            		            			
            		}        		           		      
				],
				current_group: '',
				isAdmin: false,
				isTeacher: false,
				isStudent: false
			}
		},

		methods: {
			check_status(){
				var profile = global_.status_check;

				this.$http.post(profile, {}).then((resp)=>{

					this.$store.commit('setUserGroup', resp.body.group);

					if(resp.body.group == global_.teacher_group) {
						this.current_group = global_.teacher_group;
						this.isTeacher = true;

						this.menuList[4].url = '/teacherstats';
					}

					if(resp.body.group == global_.student_group) {
						this.current_group = global_.student_group;
						this.isStudent = true;

						this.menuList[4].url = '/studentstats';
					}

					//for testing
					if(resp.body.group == global_.school_admin_group) {
						this.current_group = global_.school_admin_group;
						this.isAdmin = true;

						this.menuList[4].url = '/teacherstats';
					}

					//console.log(this.current_group);					
					//console.log(typeof(resp.status));
				}, (err)=>{
					layer.alert('请求登陆状态失败', 
						{title:'提示', area:['280px','190px']});
					console.log(err);
					if (err.status == 403) {
						this.$router.push('/login');
					}
				});
			},	

			setHelloText(){
				var curTime = new Date();
				var hours = curTime.getHours();
				
				if(hours >= 6 && hours <= 12) {
					this.hellotext = '上午好';

				} else if(hours > 12 && hours <= 18) {
					this.hellotext = '下午好';

				} else {
					this.hellotext = '晚上好';
				}
			},	

	      	quit(){
	      		//var api = '/mengoo/index.php/site/logout';
		      	var api = global_.logout;		
				this.$http.post(api, {}).then((resp)=>{
					//console.log(response);
					//delCookie('username');
					this.$router.push('/login');
				}, (err)=>{
					console.log(err);
					layer.alert('注销失败',
						{title:'提示', area:['280px','190px']});
				});	      	
		    },
		    goPersonal(){
		    	alert('个人中心');
		    }
		},

		mounted(){
			this.check_status();
			this.setHelloText();
		}
	}
</script>


<style type="text/css" scoped>
.logo{
	position: relative;
	top: 30px;
	left: 40px;
}

.welcometext {
	position: relative;
	left: 350px;
	color: #ffffff;
}

.ctrl {
	position: relative;
	top: 10px;
	width: 100%;
	height: 100%;
	text-align: right;
}

.setting {
	vertical-align: top;
	position: relative;
	text-align: center;
	display: inline-block;
	width: 100px;
	height: 80px;
	line-height: 80px;
	top: -60px;
	/*background: grey;*/
}

.logoff {
	vertical-align: top;
	position: relative;
	line-height: 80px;
	text-align: center;
	height: 80px;
	display: inline-block;
	width: 100px;
	top: -60px;
	border-left: 1.5px solid rgba(238, 238, 238, 0.5);
	/*background: grey;*/
}

.navbg {
	position: absolute;
	height: 100%;
	width: 240px;
	background: #31313c;
}
</style>