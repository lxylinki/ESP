<template>
	<div id="examquesconfig">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			添加试题
			<el-button class="altgoback" type="text" v-on:click="goBack()">返回</el-button>
		</div>	
		
		<div style="height: 20px;"></div>

		<div class="selectclass">
			
			<div class="pickexptitle">实验： </div>
			<div style="display: inline-block;">
				  <el-select v-if="showQbank" v-model="exp_value" filterable placeholder="请搜索实验名称" v-on:change="filterQs()">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.eid">
				    </el-option>
				  </el-select>	
				  <el-select v-else v-model="exp_value" filterable placeholder="请搜索实验名称" v-on:change="filterExamQs()">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.eid">
				    </el-option>
				  </el-select>	
			</div>

			<div style="display: inline-block; width: 20px;"></div>
			<div class="pickquestype">题型： </div>
			<div style="display: inline-block;">
				  <el-select v-if="showQbank" v-model="qtype_value" placeholder="请选择题型" v-on:change="filterQs()">
				    <el-option
				      v-for="item in qtype_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>		
				  <el-select v-else v-model="qtype_value" placeholder="请选择题型" v-on:change="filterExamQs()">
				    <el-option
				      v-for="item in qtype_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>			
			</div>

			<div class="searchwindow quesmng-searchwindow">

				<el-input class="searchinput"
						  v-if="showQbank" 
						  v-model="search_state"
						  v-on:keydown.native="invokeQSearch($event)"
						  placeholder="请搜索试题名称">
				</el-input>

				<el-input class="searchinput"
						  v-else 
						  v-model="search_state"
						  v-on:keydown.native="invokeSearch($event)"
						  placeholder="请搜索试题名称">
				</el-input>
				<!--
				<div v-if="showQbank" class="searchbtn quesmng-searchbtn" v-on:click="filterQs()">
					<i class="el-icon-search" ></i>
				</div>
				<div v-else class="searchbtn quesmng-searchbtn" v-on:click="filterExamQs()">
					<i class="el-icon-search" ></i>
				</div>-->

				<button v-if="showQbank" class="searchbtn"  v-on:click="filterQs()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>

				<button v-else class="searchbtn"  v-on:click="filterExamQs()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>
		</div><!--selectclass-->

		<div style="height: 10px;"></div>

		<div id='tables'>
			<div id='ltable' v-show="showQbank">
				<span>试题库</span><br>
				<span style="font-size: 14px;">点击添加完成可收起列表</span><br>

				<template>
				  <el-table
				    :data="qlist"
				    style="width: 100%; margin-top: 10px;"
				    :row-class-name="row_name">

					<el-table-column
					  label="序号"
					  :formatter="formatter"
					  min-width="50">
					</el-table-column>


				    <el-table-column
				      prop="question"
				      label="试题名称"
				      min-width="100"
				      :show-overflow-tooltip="true">
				    </el-table-column>
				    
				    <el-table-column
				      prop="exp_belong"
				      label="所属实验"
				      min-width="100">
				    </el-table-column>
				    		    
				     <el-table-column
				      prop="type"
				      label="题型"
				      min-width="100">
				      <template slot-scope="scope">
				      	<span v-if="scope.row.type == 1">单选</span>
				      	<span v-if="scope.row.type == 2">多选</span>
				      </template>
				    </el-table-column>

				    <el-table-column
				      prop="operation"
				      label="操作"
				      min-width="100">

				      <template slot-scope="scope">
				      	<el-button  v-show="!focus_qids.includes(scope.row.id)" class="op selectbtn" type="text" @click="selectRow(scope.row)">
				      		添加
				      	</el-button>
				      	<i v-show="focus_qids.includes(scope.row.id)" class="iconfont" style="color: #31a400; font-size: 150%;">&#xe612;</i>
				      </template>
				    </el-table-column>

				  </el-table>
				</template>	

				<div class="tablefooter">
					<div class="rownum">
						<span>显示 </span>
							<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 25px;">
								<option v-for="item in row_nums" v-bind:value="item.value">
									{{item.label}}
								</option>
							</select>
						<span> 条</span>
					</div>

					<div class="pages">
						<NewPager v-bind:current_page='curPage' 
					           	  v-bind:pages='totalPage'
						          @setPage='loadPage'
						></NewPager>			
					</div>				 	
				</div>			
			</div><!--end ltable-->

			<div class="add-complete" v-on:click="showToggle()">
				<i class="iconfont add-complete-icon" v-show="showQbank">&#xe659;</i><span v-show="showQbank" class="add-complete-text">添加完成</span>
				<i class="iconfont add-ques-icon" v-show="!showQbank">&#xe658;</i><span v-show="!showQbank" class="add-ques-text">添加试题</span>
			</div>


			<div id='rtable' v-bind:class="{ fulltable: !showQbank }">
				<span>{{exam_name}}</span><br>
				<span style="font-size: 14px;">添加试题：{{current_count}}  / 题数限制：{{limit}}</span><br>
				<template>
				  <el-table
				    class="mytable"
				    :data="list"
				    style="width: 100%; margin-top: 10px;"
				    :row-class-name="row_name">

					<el-table-column
					  label="序号"
					  :formatter="formatter"
					  min-width="50">
					</el-table-column>
				    
				    <el-table-column
				      prop="question"
				      label="试题名称"
				      min-width="100"
				      :show-overflow-tooltip="true">
				    </el-table-column>
				    	    
				    <el-table-column
				      prop="exp_catag"
				      label="实验分类"
				      min-width="100">
				    </el-table-column>

				    <el-table-column
				      label="题型"
				      min-width="100">
				      <template slot-scope="scope">
				      	<span v-if="scope.row.type == 1">单选</span>
				      	<span v-if="scope.row.type == 2">多选</span>
				      </template>
				    </el-table-column>

				    <!--<el-table-column
				      prop="create_time"
				      label="创建时间"
				      min-width="100">
				    </el-table-column>-->

				    <!--
				    <el-table-column
				      prop="update_time"
				      label="更新时间"
				      min-width="100">
				    </el-table-column>-->

				    <el-table-column
				      label="操作"
				      min-width="100">

				      <template slot-scope="scope">
				      	<el-button class="op" type="text" @click="deleteRow(scope.row)">
				      		<i class="iconfont">&#xe7e0;</i>删除
				      	</el-button>

				      </template>
				    </el-table-column>

				  </el-table>
				</template>

			</div>
		</div>

	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	import NewPager from '@/components/NewPager.vue';
	export default {
		components: {
			'NewPager': NewPager
		},
		data(){
			return {
				limit: 0,
				current_count: 0,
				exam_name: '',
				exam_id: '',
				list:[],
				qlist: [],
				tableData:[],
				tableQData: [],
				search_state: '',
				exp_value: '',
				exp_options:[],
				qtype_value: '',
				totalPage: 0,
				rowsPerPage: 10,
				curPage: 1,
				qtype_options:[
					{
						label: '全部',
						value: null
					},
					{
						label: '单选',
						value: 1
					},
					{
						label: '多选',
						value: 2
					}				
				],
				row_nums: [
					{
						label: '5',
						value: 5
					},
					{
						label: '10',
						value: 10
					},
					{
						label: '15',
						value: 15
					},
					{
						label: '20',
						value: 20
					},
					{
						label:'50',
						value: 50
					}
				],
				loading: null,
				focus_qids:[],
				showQbank: false
				//a question from bank to exam {in-exam id: in-bank id}
				//quesExamMap:{}
			}
		},

		methods:{
			showToggle(){
				this.showQbank = !this.showQbank;
			},

			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},
			
			formatter(row, column ,cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1+ row.ridx);
			},

			invokeQSearch(e) {
				if(e.keyCode == 13) {
					this.filterQs();
				}
			},

			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.filterExamQs();
				}
			},

			goBack(){
				this.$router.go(-1);
			},

			//Question bank
			reqQuesList(eid, type, keyword, page){
				asyncReq.call(this);
				async function asyncReq(){
					let profile = await Utils.page_check_status.call(this);	
					let resp = await Utils.reqExpList.call(this, null, profile.body.group);
					this.exp_options = resp.body._list;
					this.exp_options.unshift({'name': '所有实验', 'id': null});

					let api = global_.ques_list
							+ '?page=' 
							+ page 
							+ '&pagesize=' 
							+ this.rowsPerPage;

					let data = {
						"withOption": true,
						"eid": eid,						
						"type": type,
						"search": {
							"question": keyword,
						}
					}

					this.$http.post(api, data).then((resp)=>{

						this.tableQData = resp.body._list;
						this.totalPage = resp.body.total_page;
						for(let item of this.tableQData) {
							//console.log('Queslist:', item.eid);
							if(!this.findExp(this.exp_options, item.eid)) {
								item.exp_belong = null;
							} else {
								item.exp_belong = this.findExp(this.exp_options, item.eid).name;
							}
						}
						this.filterQData(page);
						layer.close(this.loading);
						//console.log(resp);
					}, (err)=>{
		     			layer.close(this.loading);
		     			Utils.err_process.call(this, err, '请求试题列表失败');						
					});
				}
			},

			//existing questions in exam
			reqEquesList(){
				var api = global_.exam_ques_list;
				let data = {
					"exam_id": this.exam_id,
				}
				//console.log(this.exam_id);
				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body._list;
					this.current_count = this.tableData.length;
					
					//reset focus_qids first
					this.focus_qids = [];
					for(let item of this.tableData) {
						//console.log(item.eid);
						this.focus_qids.push(item.question_id);
						if(resp.body.eids.hasOwnProperty(item.eid)) {
							item.exp_catag = resp.body.eids[item.eid].name;
						}
					}
					this.list = this.tableData;

				},(err)=>{
					Utils.err_process.call(this, err, '请求考核试题列表失败');
				});
			},

			filterQData(page) {
				this.qlist = this.tableQData;
				this.curPage = page;
			},

			filterQs(){
				//console.log(this.exp_value);
				this.reqQuesList(this.exp_value, this.qtype_value, this.search_state, this.curPage);
			},

			filterExamQs(){
				this.list = this.tableData.filter(item=> this.exp_value? item.eid === this.exp_value : true)
										  .filter(item=> this.qtype_value? item.type == this.qtype_value: true)
										  .filter(item=> this.search_state? item.question.indexOf(this.search_state) != -1 : true);
			},

			loadPage(page){
				this.reqQuesList(this.exp_value, this.qtype_value, this.search_state, page);
			},

			pageSizeChange(){
				this.filterQs();
			},

			findExp(exp_list, eid){
				for (let exp of exp_list) {
					if(exp.eid === eid) {
						return exp;
					}
				}
				return null;
			},

			selectRow(qrow){
				//console.log(this.current_count, this.limit);
				if(this.current_count === this.limit) {
					Utils.lalert('已达到最大题数限制');
					return;
				} 
				var api = global_.exam_ques_create;
				let data = {
					'exam_id': this.exam_id,
					'question_id': qrow.id
				}
				this.$http.post(api, data).then((resp)=>{
					this.focus_qids.push(qrow.id);
					this.current_count += 1;
					this.reqEquesList();

				}, (err)=>{
					Utils.err_process.call(this, err, '添加考核试题失败');
				});
			},

			remove(arr, item) {
				let i = arr.indexOf(item);
				if(i!= -1) {
					arr.splice(i, 1);
				}
			},

			deleteRow(row){
				var _this = this;
				Utils.lconfirm("确定删除考核试题？", function(){_this.delEques(row)});
			},

			delEques(row) {
				var api = global_.exam_ques_delete;
				let data = {
					'id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					this.remove(this.focus_qids, row.question_id);
					this.reqEquesList(this.curPage);
					Utils.lalert('删除考核试题成功');

				}, (err)=>{
					Utils.err_process.call(this, err, '删除考核试题失败');
				});						
			},

		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			//Utils.page_check_status.call(this);
			var edit = this.$store.state.edit;
			if(!edit) {
				this.$router.go(-1);

			} else {
				var row = this.$store.state.row;
				//console.log(row);
				this.exam_name = row.name;
				this.exam_id = row.id;
				this.limit = Number(row.count);

				this.reqQuesList(this.exp_value, this.qtype_value, this.search_state, this.curPage);
				this.reqEquesList();
			}	
		}
	}
</script>

<style type="text/css" scoped>
.altgoback {
	margin-left: 20px;
}


.pickexptitle {
	display: inline-block; 
	line-height: 60px;
}

.pickquestype {
	display: inline-block;
}

.quesmng-searchwindow {
    position: relative;
    top: -7px;	
}

#ltable, #rtable {
	position: relative;
	vertical-align: top;
	display: inline-block;
	width: 40%;
}

#rtable.fulltable {
	width: 90%;
	margin-left: 10px;
}

#rtable {
	margin-left: 100px;
}

#tables {
	margin-top: 10px;
}

.tablefooter {
	text-align: center;
}

.rownum, .pages {
	display: inline-block;
}

.pages {
	margin-left: 20px;
}

.add-complete {
	color: #ffffff;
	display: inline-block; 
	width: 40px; 
	height: 100px; 
	background: #5c9cec;
	margin-top: 52px;
	margin-left: 0;
	cursor: pointer;
	padding-top: 5px;
	box-sizing: border-box;
}

.add-complete-text, .add-ques-text {
	writing-mode: vertical-lr;
	margin-left: 10px;
	margin-top: 5px;
	font-size: 14px;
}
.add-complete-icon, .add-ques-icon {
	margin-left: 10px;
	font-size: 100%;
}
</style>