<template>
	<div id='exammanage'>

		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">考核管理</span>
		</div>


		<div style="height: 20px;"></div>

		<div class="selectclass">
			<div style="display: inline-block; width: 20px;"></div>

			<div class="pickexptitle">实验： </div>
			
			<div style="display: inline-block;">
				  <el-select filterable v-model="exp_value" placeholder="请搜索实验名称" v-on:change="filterExams()">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
			</div>


			<div class="searchwindow exam-searchwindow">
				<el-input class="exam-searchinput" v-model="search_keyword" v-on:keydown.native="invokeSearch($event)" placeholder="请搜索考核名称"></el-input>
				<button class="searchbtn" v-on:click="searchReq()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>
		</div>


		<div style="overflow: hidden;">

		<div style="height: 20px;"></div>

		<div  style="display: inline-block;">
			<el-button class="addbtn" v-on:click="addExam()">添加</el-button>
		</div>

			
		<!--choose rows per page-->
		<div style="display: inline-block; float: right; margin: 0px;">
			<span>显示 </span>
				<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 25px;">
					<option v-for="item in row_nums" v-bind:value="item.value">
						{{item.label}}
					</option>
				</select>
			<span> 条</span>
		</div>

		<div style="height: 15px;"></div>
		</div>

		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">
		    <el-table-column
		      prop="name"
		      label="考核名称"
		      min-width="180">
		    </el-table-column>
		    
		    <el-table-column
		      prop="exper_name"
		      label="所属实验"
		      min-width="200">
		    </el-table-column>

		    <el-table-column
		      prop="count"
		      label="题数限制"
		      min-width="200">
		    </el-table-column>
		    <!--
		    <el-table-column
		      prop="type"
		      label="类型"
		      min-width="200">
		    </el-table-column>
			-->
		    <el-table-column
		      label="类型"
		      min-width="200">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.type == 1">考核</span>
		      	<span v-if="scope.row.type == 2">抢救治疗</span>
		      </template>
		    </el-table-column>		    		    		    

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="200">

		      <template slot-scope="scope">

		      	<el-button  class="op" type="text" @click="editRow(scope.row)">
		      		<i class="iconfont">&#xe61a;</i>编辑
		      	</el-button>
		      	<!--<el-button type="text" @click="tableData.splice(scope.$index, 1)">-->
		      	<!--<el-button class="op" type="text" @click="delRow(scope.$index)">-->
		      	<el-button class="op" type="text" @click="deleteRow(scope.row)">
		      		<i class="iconfont">&#xe7e0;</i>删除
		      	</el-button>

		      </template>
		    </el-table-column>

		  </el-table>
		</template>


		<div style="height: 40px;"></div>
   		<NewPager v-bind:current_page='curPage' 
   	           	  v-bind:pages='totalPage'
   		          @setPage='loadPage'
   		       ></NewPager>
	</div>
</template>



<script type="text/javascript">
	import Utils from '../Utils.js';
	import NewPager from '../NewPager.vue';
	import global_ from '../Global.js';
	//import storage from '../../assets/js/storage.js';
	import store from '../../vuex/store.js';

	export default {
		components: {
			//name is Pager here
			'NewPager': NewPager
		},
		
		store: store,

		data(){
			return {	
				mod_name: 'exam-manage',
				//to store table data
				list:[],

				exp_value: null,
				type_value: '',
				search_state: '',
				search_keyword: '',

				rowsPerPage:10,
				totalRows: 0,
				totalPage: 0,
				curPage: 1,

				row_nums: [
					{
						label: '5',
						value:5
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
				tableData: [],
				exp_options: [],
				loading: null
			}
		},

		methods: {
			addExam(){
				this.$router.push('/examadd');
			},

			editRow(row){
				//storage.set('row', row);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$router.push('/examedit');
			},

			filterData(page) {
				//this.list = this.tableData.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
				this.list = this.tableData;
				this.curPage = page;
			},

			pageSizeChange(){
				this.reqData(this.search_state, this.exp_value, 1);
			},

			loadPage(page){
				//console.log('load page ' + page);
				this.reqData(this.search_state, this.exp_value, page);
			},

			deleteRow(row){
				var _this = this;
				/*
				var sure = layer.confirm("确定删除考核？",
					{title:'提示', area:['280px','190px']},
					function(){_this.delExam(row)});*/
				Utils.lconfirm("确定删除考核？", function(){_this.delExam(row)});
			},

			delExam(row){
				var api = global_.exam_delete;
				let data = {
					'id': row.id
				};

				this.$http.post(api, data).then((resp)=>{
					//console.log(resp);
					layer.alert('删除成功', 
						{title:'提示', area:['280px','190px']});
					this.reqData(this.search_state, null, this.curPage);

				}, (err)=>{
					layer.alert('考核删除失败',
						{title:'提示', area:['280px','190px']});
					console.log(err);
				});						
			},

			reqExpData(keyword, page) {
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this, keyword, page);
			    	this.exp_options = resp.body._list;
			    	this.exp_options.unshift({id: null, name:'所有实验'});
			    	//this.exp_value = this.exp_options[0].id;
				}
			},


			reqData(keyword, id, page){
				var list_api = global_.exam_list 
							 + '?page=' 
							 + page
							 + '&pagesize=' 
							 + this.rowsPerPage;

				let req_data = {
					'exper_id': id,
					'search': {
						'name': keyword
					}
				};

				this.$http.post(list_api, req_data).then((resp)=>{
					
					//console.log(resp);
					//this.totalRows = resp.body.total;
					this.$store.commit('setRowNumBefore', resp.body.total);
			    	this.$store.commit('setRowNumAfter', resp.body.total);
			    	this.$store.commit('setRowsPerPage', this.rowsPerPage);

					this.totalPage = resp.body.total_page;
					this.tableData = resp.body._list;
					this.filterData(page);
					layer.close(this.loading);
					
					/*
					for(var i in this.tableData) {
						console.log(this.tableData[i]);
					}*/
					
					/*
					this.totalRows = resp.body._list.length;			
					console.log('page=' + page + ', size=' + this.rowsPerPage);
					console.log('Requested ' + this.totalRows + ' rows.');
					*/	

				}, (err)=>{
					layer.alert('数据请求失败', 
						{title:'提示', area:['280px','190px']});
					console.log(err);
					layer.close(this.loading);
				});
			},

			filterExams(){
				this.reqData(this.search_state, this.exp_value, 1);
			},

			searchReq(){
				//this.reqData(this.search_state, null, this.curPage);
				this.search_state = this.search_keyword;
				this.reqData(this.search_state, this.exp_value, this.curPage);
			},

			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.searchReq();
				}
			}
		},
		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},
		mounted(){
			this.reqExpData('', 0);

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

			this.reqData(this.search_state, null, this.curPage);
			//layer.close(this.loading);
		}
	}
</script>


<style type="text/css" scoped>
.pickexptitle {
	display: inline-block; 
	line-height: 60px;
}

.exam-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0px;
}
</style>