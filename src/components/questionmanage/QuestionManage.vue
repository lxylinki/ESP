<template>
	<div id='questionmanage'>
		
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">试题管理</span>
		</div>

		<div style="height: 30px;"></div>
		
		<el-button class="addbtn" v-on:click="addQues()">添加试题</el-button>

		<template>
		  <el-select filterable v-model="exp_value" placeholder="请搜索实验名称" v-on:change="selectExp()">
		    <el-option
		      v-for="item in exp_options"
		      :key="item.id"
		      :label="item.name"
		      :value="item.id">
		    </el-option>
		  </el-select>
		</template>


		<template>
		  <el-select filterable v-model="exam_value" placeholder="请搜索考核名称" v-on:change="selectExam()">
		    <el-option
		      v-for="item in exam_options"
		      :key="item.id"
		      :label="item.name"
		      :value="item.id">
		    </el-option>
		  </el-select>
		</template>


		<div id='tables'>
			<div id='ltable' style="height: 100%;">
				<div class="tabletitle">未选题</div>
				<template>
				    <el-table
				      class="unpicked"
				      :data="unselected">

				      <el-table-column
				        prop="question"
				        label="问题"
				        min-width="100"
				        :show-overflow-tooltip="true">
				      </el-table-column>

				      <el-table-column
				        label="题型"
				        min-width="100">
				        <template slot-scope="scope">
			      			<span v-if="scope.row.type == 1">单选</span>
			      			<span v-if="scope.row.type == 2">多选</span>
			      		</template>
				      </el-table-column>

				      <el-table-column
				        label="删除"
				        min-width="100">
				     	<template slot-scope="scope">
				      		<el-button  class="op" type="text" @click="deleteRow(scope.row, scope.$index)">
				      			<i class="iconfont" style="font-size: 120%;">&#xe7e0;</i>
				      		</el-button>
					    </template>
				      </el-table-column>

				      <el-table-column
				        label="选择"
				        min-width="100">
				     	<template slot-scope="scope">
					      	<el-button class="op" type="text" @click="select(scope.row, scope.$index)">
					      		<i class="iconfont" 
					      		   style="font-size: 150%; color: #0099ff;">&#xe629;</i>
					      	</el-button>
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

			</div>


			<div id='rtable' style="height: 100%;">
				<div class="tabletitle">已选题</div>
			   <template>
			    <el-table
			      class="picked"
			      :data="selected">
			      <el-table-column
			        label="序号"
			        type="index">
			      </el-table-column>

			      <el-table-column
			        prop="question"
			        label="问题"
			        min-width="100"
			        :show-overflow-tooltip="true">
			      </el-table-column>

			      <el-table-column
			        label="题型"
			        min-width="100">
			        <template slot-scope="scope">
		      			<span v-if="scope.row.type == 1">单选</span>
		      			<span v-if="scope.row.type == 2">多选</span>
		      		</template>
			      </el-table-column>

			      <el-table-column
			        label="取消选择"
			        min-width="100">
			        <template slot-scope="scope">
				      	<el-button  class="op" type="text" @click="remove(scope.row, scope.$index)">
				      		<i class="iconfont" style="font-size: 150%;">&#xe602;</i>
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
	import NewPager from '../NewPager.vue';
	import global_ from '../Global.js';
	import Utils from '../Utils.js';
	import store from '../../vuex/store.js';

	export default {
		store: store,
		data(){
			return {
				mod_name: 'ques-manage',
				//exp_selected: false,
				//exam_selected: false,
				exp_value:'',
				exam_value:'',
				exp_id: '',
				exp_options: [],
				exam_options: [],
				unselected: [],
				selected: [],

				curPage: 1,
				totalPage: 0,
				rowsPerPage: 10,
				row_nums:[
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
						label:'25',
						value: 25
					}				
				],
				total_exp: 0,
				total_exam: 0,
				loading: null
			}
		},

		components: {
			'NewPager': NewPager
		},

		methods: {
			addQues(){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setExpId', this.exp_value);
				this.$store.commit('setExamId', this.exam_value);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.$router.push('/questionadd');
			},
			
			select(row, idx){
				//update
				row.display = '1';
				//send update
				var api = global_.question_update;

				this.$http.post(api, row).then((resp)=>{
					this.selected.push(row);
					this.unselected.splice(idx, 1);
					if(this.unselected.length == 0 && this.curPage > 1) {
						this.reqUnQsData(this.exam_value, 1, '', this.curPage - 1);
					}
				}, (err)=>{
					layer.alert('已超出题数限制',
						{title:'提示', area:['280px','190px']});
					console.log(err);
				});
				//console.log(row);
			},

			//unselect
			remove(row, idx){
				row.display = '0';
				var api = global_.question_update;
				this.$http.post(api, row).then((resp)=>{
					this.selected.splice(idx, 1);
					this.unselected.push(row);

					var more_page = Math.ceil(this.unselected.length / this.rowsPerPage);
					/*
					console.log('current page:' + this.curPage);
					console.log('total len:' + this.unselected.length);
					console.log('rows per page:' + this.rowsPerPage);
					*/
					this.reqUnQsData(this.exam_value, 1, '', this.curPage + more_page - 1);

				}, (err)=>{
					layer.alert('移除试题失败',
						{title:'提示', area:['280px','190px']});
					console.log(err);
				});				
			},

			deleteRow(row, idx){
				var _this = this;
				var sure = layer.confirm('确定删除试题？',
					{title:'提示', area:['280px','190px']},
					function(){_this.delQues(row, idx)});
			},

			delQues(row, idx){
				var api = global_.question_delete;

				let data = {
					'exam_id': row.exam_id,
					'id': row.id
				};

				this.$http.post(api, data).then((resp)=>{
					this.unselected.splice(idx, 1);
					layer.alert('删除试题成功',
						{title:'提示', area:['280px','190px']});
					//console.log(resp);

				}, (err)=>{
					layer.alert('试题已被选定，删除试题失败',
						{title:'提示', area:['280px','190px']});
					console.log(err);
				});				
			},

			reqExpData(keyword, page) {
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this, keyword, page);
			    	this.exp_options = resp.body._list;
				}
			},

		     initReq(keyword, page) {
		     	asyncReq.call(this);
		     	async function asyncReq(){
					let expData = await Utils.reqExpList.call(this, keyword, page);
					this.exp_options = expData.body._list;
					if(this.exp_options.length > 0) {
						this.exp_value = this.exp_options[0].id;
					}
					
					let examData = await this.reqExamData.call(this, keyword, this.exp_value, page);
					this.exam_options = examData.body._list;
					if(this.exam_options.length > 0) {
						this.exam_value = this.exam_options[0].id;
					}
					this.selectExam();		     		
		     	}
		     },

		    selectExp(){
		     	//this.exp_selected = true;
		     	//clear exam select
		     	this.exam_value = '';
		     	//this.exp_value is experiment id
		     	this.reqExamData('', this.exp_value, 1);
		     },

			reqExamData(keyword, id, page){
				return new Promise((resolve, reject)=>{
					var list_api = global_.exam_list 
								 + '?page=' 
								 + page; 
								 //+ '&pagesize=' 
								 //+ this.rowsPerPage;

					let req_data = {
						'exper_id': id,
						'search': {
							'name': keyword
						}
					};

					this.$http.post(list_api, req_data).then((resp)=>{

						this.total_exam = resp.body.total;
						var full_list_api = list_api + '&pagesize=' + this.total_exam;

						this.$http.post(full_list_api, req_data).then((resp)=>{
							this.exam_options = resp.body._list;
							resolve(resp);

						},(err)=>{
							Utils.lalert('数据请求失败');
							console.log(err);
						});
						

					}, (err)=>{
						layer.alert('数据请求失败',
							{title:'提示', area:['280px','190px']});
						console.log(err);
					});
				});
			},

			selectExam(){
				this.reqUnQsData(this.exam_value, 1, '', 1);
				this.reqSlQsData(this.exam_value, 1, '', 1);
			},

			//request unselected questions
			reqUnQsData(exam_id, opt, keyword, page){
				var api = global_.question_list
						+ '?page='
						+ page
						+ '&pagesize='
						+ this.rowsPerPage;

				let data_0 = {
					'exam_id': exam_id,
					'withOption': opt,
					'search':{
						'name': keyword
					},
					'display': 0
				};

				this.$http.post(api, data_0).then((resp)=>{
					this.unselected = resp.body._list;
					this.$store.commit('sign', this.mod_name);
					this.$store.commit('setRowNumBefore', resp.body.total);
			    	this.$store.commit('setRowNumAfter', resp.body.total);
					this.totalPage = resp.body.total_page;
			    	this.curPage = page;
			    	//layer.close(this.loading);

				}, (err)=>{
					layer.alert('未选题数据请求失败',
						{title:'提示', area:['280px','190px']});
					console.log(err);
				});

			},
			
			reqSlQsData(exam_id, opt, keyword, page){
				//return all data???
				var api = global_.question_list + '?page=1';

				let data_1 = {
					'exam_id': exam_id,
					'withOption': opt,
					'search':{
						'name': keyword
					},
					'display': 1
				};

				this.$http.post(api, data_1).then((resp)=>{
					//console.log(resp);
			    	var total_sq = resp.body.total;
			    	var full_list_api = api + '&pagesize='+ total_sq;

			    	this.$http.post(full_list_api, data_1).then((resp)=>{
			    		this.selected = resp.body._list;
			    		layer.close(this.loading);

			    	},(err)=>{
			    		Utils.lalert('入选题数据请求失败');
			    		console.log(err);
			    		layer.close(this.loading);
			    	});

				}, (err)=>{
					layer.alert('入选题数据请求失败',
						{title:'提示', area:['280px','190px']});
					console.log(err);
				});

			},

			pageSizeChange(){
				this.reqUnQsData(this.exam_value, 1, '', 1);
			},

			loadPage(page) {
				this.reqUnQsData(this.exam_value, 1, '', page);
			}
		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			if (this.$store.state.exp_id === '' || this.$store.state.exp_id === '') {
				//all in one function
				this.initReq('', 0);

			} else {
				this.reqExpData('', 1);
				this.exp_value = this.$store.state.exp_id;
				this.reqExamData('', this.exp_value, 1);
				this.exam_value = this.$store.state.exam_id;
				
				var name = this.$store.state.last_author;

				if(name === this.mod_name) {
					var before = this.$store.state.row_num_before,
						after = this.$store.state.row_num_after,
						pagesize = this.$store.state.rows_per_page,
						keyword = this.$store.state.current_search,
						curpage = this.$store.state.current_page;

					if (pagesize > 0) {
						this.rowsPerPage = pagesize;
					}

					if (keyword) {
						this.search_state = keyword;
					}

					//item added: default append to list end
					if(after > before) {
						this.curPage = Math.ceil(after / this.rowsPerPage);	

					} else if(curpage > 0) {
						this.curPage = curpage;
					} 				
				}

				this.reqUnQsData(this.exam_value, 1, '', this.curPage);
				this.reqSlQsData(this.exam_value, 1, '', 1);				
			}
		}
	}
</script>

<style type="text/css" scoped> 
.tabletitle {
	font-size: 14px;
	font-weight: bold;
	background: #d7d7d7;
	/*color: white;*/
	text-align: center;
	line-height: 40px;
	border-bottom: 1px solid #d7d7d7;
}

.iconfont {
	line-height: 6px;
}

#ltable, #rtable {
	vertical-align: top;
	display: inline-block;
	width: 45%;
}

#rtable {
	margin-left: 100px;
}

#tables {
	margin-top: 20px;
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

</style>