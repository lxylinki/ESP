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
							<i class="iconfont" style="color: white">&#xe606;</i>
							<el-button type="text" style="color: white;" v-on:click="goPersonal()">设置</el-button>
						</div>
						<div class="logoff">
							<i class="iconfont" style="color: white;">&#xe62e;</i>
							<el-button type="text" style="color: white" v-on:click="quit()">退出</el-button>
						</div>
					</div>
				</el-header>


				<el-container>
        			<el-aside>
        				<!--<div style="height: 110px; background: #31313c"></div>-->
        				<Nav v-bind:menuList='menuList'
        				     v-bind:curGroup='current_group'></Nav>
        				<!--<div class="navbg"></div>-->
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
	import Utils from '@/components/Utils.js';
	//import { setCookie, getCookie, delCookie } from './assets/js/cookie.js';
	
	export default {
		components:{
			'Nav': Nav
		},
		store: store,
		data(){
			return {
				hellotext: '',
				//only the outmost items have highlight(for icon display)
				menuList:[
					{
	            		name:'账户管理',
	            		url: "",
	            		isSubShow: false,
	            		highlight: false,
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
	            		],
	            		//as Nav
	            		icon_highlight:require('@/assets/account.png'),
	            		icon: require('@/assets/account_dark.png')
            		}, 

            		{
	            		name:'实验项目管理',
	            		url: "/expmanage",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group
	            		],
	            		isSubShow:false,
	            		highlight:false,
	            		subItems:[] ,
	            		icon_highlight:require('@/assets/exp.png'),
	            		icon: require('@/assets/exp_dark.png')          		            			
            		},

            		{
	            		name:'公共题库管理',
	            		url: "/questionmanage",
	            		userGroup: [
	            			global_.school_admin_group,
	            			global_.teacher_group 
	            		],
	            		isSubShow:false,
	            		highlight:false,
	            		subItems:[],
	            		icon_highlight:require('@/assets/ques.png'),
	            		icon: require('@/assets/ques_dark.png') 	                  		            			
            		},

            		{
	            		name:'考核管理',
	            		url: "/exammanage",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group
	            		],
	            		isSubShow:false,
	            		highlight:false,
	            		subItems:[],
	            		icon_highlight:require('@/assets/exam.png'),
	            		icon: require('@/assets/exam_dark.png')              		            			
            		},
             		{
	            		name:'实验报告',
	            		url: "",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.student_group
	            			
	            		],
	            		isSubShow:false,
	            		highlight:false,
	            		subItems:[
	            			{
	            				name: '模板管理',
	            				url: '/tplmanage',
			            		userGroup: [
			            			global_.school_admin_group, 
			            		],
			            		isSubShow: false,
			            		subItems:[]
	            			},
	            			{
	            				name: '实验报告',
	            				url: '/expreport',
			            		userGroup: [
			            			global_.school_admin_group, 
			            			
			            		],
			            		isSubShow: false,
			            		subItems:[]
	            			},
	            			{
	            				name: '报告记录',
	            				url: '/reportrec',
			            		userGroup: [
			            			global_.school_admin_group, 
			            			
			            		],
			            		isSubShow: false,
			            		subItems:[]
	            			},
	            			{
	            				name: '报告成绩',
	            				url: '/reportscore',
			            		userGroup: [
			            			global_.school_admin_group, 
			          
			            		],
			            		isSubShow: false,
			            		subItems:[]
	            			},

	            			//student only 
	            			{
	            				name: '实验报告列表',
	            				url: '/explist',
			            		userGroup: [
			            			global_.student_group, 
			            		],
			            		isSubShow: false,
			            		subItems:[]
	            			},	
	            			{
	            				name: '实验报告成绩',
	            				url: '/expscore',
			            		userGroup: [
			            			global_.student_group, 
			            		],
			            		isSubShow: false,
			            		subItems:[]
	            			}
	            		],
	            		icon_highlight:require('@/assets/report.png'),
	            		icon: require('@/assets/report_dark.png') 	                        		            			
            		},
             		{
	            		name:'成绩统计',
	            		url: "/teacherstats",
	            		userGroup: [
	            			global_.school_admin_group, 
	            			global_.teacher_group,
	            		],
	            		isSubShow:false,
	            		highlight:false,
	            		subItems:[],
	            		icon_highlight:require('@/assets/stats.png'),
	            		icon: require('@/assets/stats_dark.png') 	                        		            			
            		},
             		{
	            		name:'我的成绩',
	            		url: "/studentstats",
	            		userGroup: [
	            			global_.student_group 
	            		],
	            		isSubShow:false,
	            		highlight:false,
	            		subItems:[],
	            		icon_highlight:require('@/assets/stats.png'),
	            		icon: require('@/assets/stats_dark.png') 	                        		           	
            		},
            		/*
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
            		} */       		           		      
				],
				current_group: '',
				isAdmin: false,
				isTeacher: false,
				isStudent: false
			}
		},

		methods: {
			check_status(){
				let profile = global_.status_check;

				this.$http.post(profile, {}).then((resp)=>{

					//this.$store.commit('setUserGroup', resp.body.group);

					if(resp.body.group == global_.teacher_group) {
						this.current_group = global_.teacher_group;
						this.isTeacher = true;
					}

					if(resp.body.group == global_.student_group) {
						this.current_group = global_.student_group;
						this.isStudent = true;
					}

					//for testing
					if(resp.body.group == global_.school_admin_group) {
						this.current_group = global_.school_admin_group;
						this.isAdmin = true;
					}

					//console.log(this.current_group);					
					//console.log(typeof(resp.status));
				}, (err)=>{
					Utils.err_process.call(this, err, '请求登陆状态失败'); 
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
					Utils.err_process.call(this, err, '注销失败');
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
	z-index: 1;
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
	z-index: 1;
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

</style>