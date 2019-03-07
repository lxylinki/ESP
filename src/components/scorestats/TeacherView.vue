<template>
	<div id="teacherview">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			成绩统计
		</div>

		<div class="selectclass">
			<div style="display: inline-block; width: 20px;"></div>

			<div class="pickexptitle">实验： </div>		
			<div style="display: inline-block;">
				  <el-select filterable v-model="exp_value" placeholder="请搜索实验名称" v-on:change="">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>				
			</div>

			<div style="display: inline-block; width: 20px;"></div>

			<div class="pickclasstitle">班级：</div>			
			<div style="display: inline-block;">
				  <el-select filterable v-model="class_value" placeholder="请搜索班级名称" v-on:change="">
				    <el-option
				      v-for="item in class_options"
				      :key="item.id"
				      :label="item.class_name"
				      :value="item.id">
				    </el-option>
				  </el-select>		
			</div>

			<div class="searchwindow teacher-searchwindow">
				<el-input class="teacher-searchinput" v-model="search_keyword" v-on:keydown.native="" placeholder="请搜索学生姓名"></el-input>
				<button class="searchbtn"  v-on:click="">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>
		</div><!--selectclass-->



	</div>
</template>


<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	export default {
		data(){
			return {
				search_keyword: '',
				exp_value: '',
				class_value: '',
				exp_options: [],
				class_options: []
			}
		},

		methods: {
			reqExpData(keyword, page) {
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this, keyword, page);
			    	this.exp_options = resp.body._list;
			    	this.exp_options.unshift({'name': '所有实验', 'id': null});
				}
			},

			reqClassData(tkeyword, ckeyword, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqClassList.call(this, tkeyword, ckeyword, page);
	     			this.class_options = resp.body._list;
	     			this.class_options.unshift({id: null, class_name: '全部班级'});					
				}
			},
		},

		mounted(){
			this.reqExpData(null, 1);
			this.reqClassData(null, null, 1);
		}
	}
</script>


<style type="text/css">
.pickexptitle {
	display: inline-block;
	line-height: 60px;
}

.teacher-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0;
}

.leftpanel {
	width: 100%; 
	height: 100%;
	display: inline-block;
	/*float: left;*/
	margin-right: 42px;
	margin-top: 20px;
}

.rightpanel {
	width: 100%; 
	height: 100%; 
	/*float: left;*/ 
	display: inline-block; 
	border-left: 1px solid #d7d7d7;
	margin-top: 20px;
}

.pickclasstitle {
	display: inline-block;
}
	
</style>