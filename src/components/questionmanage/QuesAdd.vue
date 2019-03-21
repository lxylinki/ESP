<template>
	<div id="quesadd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			公共题库管理
		</div>

		<div class="ques-type">
			<div class="ques-type-title">题型:</div>
			<div class="schoice">
				<input type="radio" id="single" name="qtype" value='1' v-model="type">
				<label for="single">单选</label>
			</div>
			<div class="mchoice">
				<input type="radio" id="multi" name="qtype" value='2' v-model="type">
				<label for="multi">多选</label>
			</div>
		</div>


		<div class="exp-belong">所属实验： 
			<template>
			  <el-select class="longselect exp-belong-input"
			  			 v-model="exp_value" 
			  			 placeholder="请搜索实验名称">
			    <el-option
			      v-for="item in exp_options"
			      :key="item.id"
			      :label="item.name"
			      :value="item.eid">
			    </el-option>
			  </el-select>
			</template>			
			<span v-bind:class="{red: !exp_value, white: exp_value}">*</span>
		</div>

		
		<div class="question">
			<div class="ques-body-title">题干：</div>
				
			<div class="ques-body">
				<el-input type="textarea"
						  class="ques-body-input"
						  v-model="question"
						  placeholder="必填">
				</el-input>
			</div>
		</div>

		<div class="opts">
			<div class="ans-header">
				<div class="ans-opt-col">答案选项</div>
				<div class="add-del-col">增加/删除</div>
				<div class="right-opt-col">正确选项</div>
				<div class="mv-updown-col">上移下移</div>
			</div>
		
			<div class="opts-div">
				<Option v-for="(opt, idx) in opt_list" 
					 v-bind:key="opt.id"
					 v-bind:opts_num="opts_num"
					 v-bind:idx="idx"
					 v-bind:opt="opt"
					 v-on:delete="del_opt"
					 v-on:add="add_opt"></Option>
			</div>
		</div>
			
		<div class="anls">
			<div class="anls-title">题目解析：</div>	
			<div class="anls-body">
				<el-input type="textarea" class="anals-body-input" v-model="analyze"></el-input>
			</div>
		</div>
				
		<div class="btn-group">
			<el-button class="confirm" v-on:click="">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
		</div>
	</div>
</template>

<script type="text/javascript">
	import Option from './Option.vue';
	import Utils from '@/components/Utils.js';
	export default {
		components: {
			'Option': Option
		},
		data(){
			return {
				type: 1,
				exp_value: null,
				exp_options: [],
				question: '',
				analyze: '',
				opts_num: 0,
				//name as id
				opt_list: [
					{	
						id: 0,
						name: '选项A',
						show: true,
						text: '',
						correct: false,
					},
					{	
						id: 1,
						name: '选项B',
						show: true,
						text: '',
						correct: false,
					},
					{
						id: 2,
						name: '选项C',
						show: true,
						text: '',
						correct: false,
					},
					{
						id: 3,
						name: '选项D',
						show: true,
						text: '',
						correct: false,
					},
					{	
						id: 4,
						name: '选项E',
						show: true,
						text: '',
						correct: false,
					},																				
				],
				//
				opt_names: ['选项A', '选项B', '选项C', '选项D', '选项E']
			}
		},

		methods: {
			active_rows(){
				return this.opt_list.filter(item=>item.show);
			},

			inactive_rows(){
				return this.opt_list.filter(item=>!item.show);
			},

			goBack(){
				this.$router.go(-1);
			},

			fillExpSelect(profile) {
				asyncReq.call(this);
				async function asyncReq(){	
					let resp = await Utils.reqExpList.call(this, null, profile.body.group);
					this.exp_options = resp.body._list;
					this.exp_options.unshift({'name': '所有实验', 'id': null});
				}				
			},

			//helper
			findIdx(target_opt){
				for(let i in this.opt_list) {
					if(this.opt_list[i].id === target_opt.id) {
						return Number(i);
					}
				}
				return -1;
			},

			del_opt(opt) {
				opt.show = false;
				opt.text = '';
				opt.correct= false;

				let active_opts = this.active_rows();
				for(let i in active_opts) {
					active_opts[i].name = this.opt_names[i];
				}
				this.opts_num = active_opts.length;
			},

			//idx is orig index in list
			add_opt(idx) {
				let inactive_opts = this.inactive_rows(),
					add_target = this.opt_list[idx];

				if(inactive_opts.length > 0) {
					let i = this.findIdx(inactive_opts[0]);
					let first_hidden = this.opt_list.splice(i, 1)[0];
					let new_idx = this.findIdx(add_target);
					this.opt_list.splice(new_idx+1, 0, first_hidden);
					first_hidden.show = true;
				}

				let active_opts = this.active_rows();
				for(let i in active_opts) {
					active_opts[i].name = this.opt_names[i];
				}
				this.opts_num = active_opts.length;
			}
		},

		mounted(){
			Utils.page_check_status.call(this).then(resp=>{
				this.fillExpSelect(resp);
			});	
			this.opts_num = this.active_rows().length;	
		}
	}
</script>

<style type="text/css" scoped>
.ques-type {
	margin-top: 30px;
	margin-bottom: 40px;
}

.ques-type-title {
	display: inline-block;
	margin-left: 38px;
	margin-right: 20px;
}

div>.schoice input {
	width: 18px;
	height: 18px;
}

div>.mchoice input {
	width: 18px;
	height: 19px;
}

.schoice {
	display: inline-block;
}

.mchoice {
	display: inline-block;
	margin-left: 40px;
}

.exp-belong {
	margin-left: 5px;
	margin-bottom: 30px;
}

.exp-belong-input {
	margin-left: 10px;
}

.red {
	color: red;
}

.white {
	/*same with bg color*/
	color: white;
	pointer-events: none;
}
.ques-body-title {
	position: relative;
	vertical-align: top;
	display: inline-block;
	margin-left: 36px;	
}

.ques-body {
	display: inline-block;
	position: relative;
	left: 0px;	
}

.ques-body-input {
	margin-left: 10px;
}

.longselect /deep/ .el-input__inner {
	height: 36px;
	width: 300px;
}

.ans-header {
	position: relative;
	height: 40px;
	width: 100%;
	background: #f0f7ff;
}

.ans-opt-col {
	display: inline-block;
	margin-right: 640px;
	margin-top: 8px;
	margin-left: 10px;
}

.add-del-col {
	display: inline-block;
	margin-left: 5px;
	margin-right: 10px;
}

.right-opt-col {
	display: inline-block;
	margin-left: 10px;
}

.mv-updown-col {
	display: inline-block;
	margin-left: 20px;
}

.opts {
	border: 1px solid red;
	width:1000px;
	height: 100%;
	border:1px solid rgba(92,156,236,1);
	border-radius:0px 0px 4px 4px;
	margin-left: 98px;
	margin-bottom: 30px;
	margin-top: 30px;
}

.opts-div {
	position: relative;
	width: 1000px;
	text-align: right;
	width: 100%;
	padding-bottom: 20px;
}

.anls {
	margin-top: 15px;
	margin-right: 15px;
	position: relative;
}


.btn-group {
	position: relative;
	margin-left: 95px;
	margin-bottom: 40px;
}

.opt-correct {
	position: relative;
	top: 15px;
}

.ans-opt {
	/*must set position for animation*/
	position: relative;
	height: 60px;
	line-height: 60px;
}

.anls-title {
	margin-left: 10px;
	display: inline-block;
	vertical-align: top;
}

.anls-body {
	display: inline-block;
	margin-left: 2px;
	margin-bottom: 40px;
}


.longinput {
	box-sizing: border-box;
}
</style>