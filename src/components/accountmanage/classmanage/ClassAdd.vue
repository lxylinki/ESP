<template>
	<div id='classadd'>
		<!--<h3>I am Class Creation component</h3>-->
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			班级管理
		</div>
		
		<!--Just a space holder-->
		<div style="height: 40px;"></div>

		<div class='input-group'>

			<div class='textinputs'>
				<div> 班级名称： 
					<input  class="longinput" type="text" v-model="classname">
					<!--<el-input class="usrenter" v-model="classname" placeholder="必填"></el-input>-->
					<span class="redalert" v-show="!classname">*</span>
					<span class="whitedefault" v-show="classname">*</span>
					<!---->
				</div>
				<div style="height: 30px;"></div>
				<div> 专业： 
					<input class="longinput" type="text" v-model="major">
					<!--<el-input class="usrenter" v-model="major" placeholder=""></el-input>-->
					<span class="redalert" v-show="!major">*</span>
					<span class="whitedefault" v-show="major">*</span>
				</div>
				<div style="height: 30px;"></div>
				<div> 年级： 
					<input class="longinput" type="text" v-model="grade">
					<!--<el-input class="usrenter" v-model="major" placeholder=""></el-input>-->
					<span class="redalert" v-show="!grade">*</span>
					<span class="whitedefault" v-show="grade">*</span>
				</div>
			</div>



			<div class='addteacher'>
				<div class="teachertitle">所属老师：</div>
				
				<div class="teacheradded">
					<li class="added" v-for='(teacher, key) in teachers_added'>
						<el-tag closable v-on:close="rmTeacher(key)">{{teacher.realname}}</el-tag>
					</li>
				</div>
				
				<div :class="{addteacherbtn:true, startline:teachers_added.length == 0}">
					<el-button type="text" @click="showAllTeachers()">+添加</el-button>
				</div>

				<div style="height: 30px;"></div>

				<div class="btn-group">
					<el-button class="confirm" v-on:click="addCreate()">确定</el-button>
					<el-button class="goback" v-on:click="goBack()">返回</el-button>
				</div>

			</div>

		    <!-------------------------------------------------------------------------------------------->
		    <!--
			<el-select id="allteachers" v-model="value" filterable placeholder="请选择">
				<el-option v-for="item in teachers" 
						   :key="item.value" 
						   :label="item.label" 
						   :value="item.value">        	
				</el-option>
			</el-select>-->
		    <!-------------------------------------------------------------------------------------------->
		    <!--
			<div id="example">
				<select v-model='value' v-on:change="showChoice()">
					<option v-for='item in teachers' :value='item.value'>
						{{ item.label }}
					</option>
				</select>
			</div>-->
		    <!-------------------------------------------------------------------------------------------->
		    <div id="allteachers" v-show="showSelect">

		    	<div class="select-header select-header-normal" v-on:click="activate()">
			    	<input type="text" class="select-header-text" placeholder="请搜索教师姓名" v-model="search_state"></input>
					<i class="iconfont togglesign" v-on:click="toggleList()" v-show="!showToggle">&#xe607;</i>
					<i class="iconfont togglesign" v-on:click="toggleList()" v-show="showToggle">&#xe608;</i>	
		    	</div>

				<div class="select-list" v-show="showToggle" style="overflow-y: scroll; height: 190px;">
			    	<li class="select-item" v-for='item in filtered_teachers' v-on:click="makeChoice(item)">{{item.realname}}</li>				
				</div>
		    </div>

		</div>
	</div>
</template>


<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';

	export default{
		data(){
			return {
				showSelect: false,
				teacher_value: '',
				key: 0,
				dialogVisible: false,
				classname: '',
				major: '',
				grade: '',
				teachers_added: [],
				showToggle: true,
				//all teachers
				teachers: [],
				class_id: '',
				filtered_teachers:[],
				search_state:'',
			};
		},

		methods: {
			activate(){
				$('.select-header').removeClass('select-header-normal').addClass('select-header-active');
			},

			toggleList(){
				this.showToggle = !this.showToggle;
			},
			
			makeChoice(teacher) {
				//document.querySelector('.select-header-text').value = teacher.realname;
				this.search_state = teacher.realname;
				this.teacher_value = teacher.user_id;
			},

			showAllTeachers(){
				var _this = this;
				layer.open({
					type: 1,
					btn: ['确定','取消'],
					area: ['280px', '250px'],
					title: '',
					content: $('#allteachers'),
					yes: function(){
						_this.addTeacher();
					},
					btn2: function(){
						//console.log('CANCEL');
					}
				  /*
				  end: function(){
				  	$('.teacherlist').css('display','none');
				  }*/
				});
			},

			reqTeacherData(keyword, page) {
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqTeacherList.call(this, keyword, page);
	     			this.teachers = resp.body._list;	
	     			this.filtered_teachers = resp.body._list;				
				}				
			},

			createClass(){
				var api = global_.class_create;
				let data = {
					'name': this.classname,
					'grade': this.grade,
					'major': this.major
				}
				this.$http.post(api, data).then((resp)=>{
					this.class_id = resp.body.id;
					this.addTeachers();

				}, (err)=>{
					Utils.lalert('班级创建失败');
					console.log(err);
				});
			},

			addOneTeacher(clsid, usrid){
				var api = global_.class_addteacher;
				let data = {
					'id': clsid,
					'user_id': usrid
				}
				this.$http.post(api, data).then((resp)=>{
					//console.log(resp);
				},(err)=>{
					Utils.lalert('教师添加失败');
					console.log(err);
				});
			},

			addTeachers(){
				for(var i in this.teachers_added) {
					this.addOneTeacher(this.class_id, this.teachers_added[i].user_id);
				}
			},

			addTeacher(){
				if(this.teacher_value) {
					for(var i=0; i<this.teachers.length; i++) {
						if (this.teachers[i].user_id === this.teacher_value) {
							if(! Utils.contains_obj(this.teachers_added, this.teachers[i])) {
								this.teachers_added.push(this.teachers[i]);
								return;
							}
						}
					}
				}
			},

			rmTeacher(key){
				this.teachers_added.splice(key, 1);
			},

			addCreate(){
				// 1. create class
				// 2. add all teachers
				this.createClass();
			},

			//back one step
			goBack(){
				this.$router.go(-1);
			}
		},
		watch: {
			search_state(newVal, oldVal) {
				this.filtered_teachers = this.teachers.filter( item => item.realname.indexOf(this.search_state) != -1);
			}
		},
		mounted(){
			$(document).on('click', 'li.select-item', function(){
				$(this).addClass("highlight").siblings().removeClass("highlight");
			});	
			$(document).on('blur', '.select-header', function(){
				$(this).removeClass('select-header-active').addClass('select-header-normal');
			});

			this.reqTeacherData('', 1);
		}
	};
</script>



<style type="text/css" scoped>

.startline {
	margin-left: 23px;
}

.select-header {
	font-size: 14px;
	margin: auto;
	margin-top: 20px;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 10px;
	width: 200px;
	height: 30px;
	border-radius: 5px;
}

.select-header-normal {
	border: 1px solid #cccccc;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.select-header-active {
	border: 1px solid #619cde;
	box-shadow: 0 1px 6px rgba(97, 156, 222, 0.4);
}

.select-list {
	margin: auto;
	padding-left: 5px;
	padding-right: 5px;
	margin-top: 5px;
	width: 210px;
	height: 100%;
	border: 1px solid #cccccc;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.highlight, .select-item:hover {
	background: #f7f8fc;
}

.select-item {
	font-size: 14px;
	margin: 5px;
	height: 30px;
	line-height: 30px;
}

/*create space between 班级名称，专业*/
.redalert {
	color: red;
}
.whitedefault {
	/* background color */
	color: #ffffff;
}

.input-group {
	text-align: left;
}

.textinputs {
	width: 420px;
	height: 200px;
	text-align: right;
}

.added {
	display: inline-block;
	margin: 5px;
}

.btn-group {
	display: inline-block;
	margin-left: 105px;
}


.teachertitle {
	display: inline-block;
	position: relative;
	left: 20px;
}

.togglesign {
	float: right;
}

.select-header-text, .togglesign {
	display: inline-block;
}

.select-header-text {
	border: none;
}

.select-header-text:focus {
	outline: none;
}

/*display area for added teachers*/
.teacheradded {
	display: inline-block;
	margin-left: 18px;
}

.addteacherbtn {
	display: inline-block;
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

.togglesign {
	font-size: 12px;
	cursor: pointer;
}

</style>