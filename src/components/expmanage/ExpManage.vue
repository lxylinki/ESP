<template>
	<div id='expmanage'>
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">实验管理</span>
		</div>

		<!--<button @click="fn">弹出</button>-->

		<div style="height: 20px;"></div>


		<div class="selectclass">
			<div class="searchwindow exp-searchwindow">

				<el-input class="exp-searchinput" 
						  v-model="search_state"
						  v-on:keydown.native="invokeSearch($event)"
						  placeholder="请搜索实验名称">		  
				</el-input>

				<button class="searchbtn exp-searchbtn" v-on:click="searchReq()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>

			</div>


		</div>

		<div style="height: 20px;"></div>

		<div  style="display: inline-block;">
			<el-button class="addbtn" v-on:click="addExp()">添加</el-button>
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

		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">
		    <el-table-column
		      prop="name"
		      label="实验名称"
		      min-width="100">
		    </el-table-column>
		    
		    <el-table-column
		      prop="join_count"
		      label="学习人次"
		      min-width="300">
		    </el-table-column>
		    
		    <!--
		     <el-table-column
		      prop="id"
		      label="ID">
		    </el-table-column>-->

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="100">

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
	import NewPager from '../NewPager.vue';
	//import Pager from '../Pager.vue';
	import global_ from '../Global.js';
	import Utils from '../Utils.js';
	//import VueEvent from '../../assets/js/VueEvent.js';
	//import storage from '../../assets/js/storage.js';
	import store from '../../vuex/store.js';

	export default {
		components: {
			//name is Pager here
			//'Pager': Pager,
			'NewPager': NewPager
		},
		store: store,
		data(){
			return {	
				mod_name: 'exp-manage',
				//to store table data
				list:[],
				dataChanged: false,

				dialogVisible: false,
				value: '',
				search_state: '',
				options: [],

				rowsPerPage:10,
				totalRows: 0,
				totalPage: 0,
				curPage: 1,


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
				tableData: [],
				loading: null																				
			}
		},

		methods: {
			addExp(){
				this.$router.push('/expupload');
			},

			editRow(row){
				//console.log(row);
				//VueEvent.$emit('to-edit', row);
				//storage.set('row', row);
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$router.push('/expedit');

			},

			filterData(page) {
				//this.list = this.tableData.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
				this.list = this.tableData;
				this.curPage = page;
			},

			pageSizeChange(){
				//reload data
				//this.filterData(this.curPage);
				this.reqData(this.search_state, 1);
			},

			loadPage(page){
				//console.log('load page ' + page);
				this.reqData(this.search_state, page);
			},

			deleteRow(row){
				var _this = this;
				var sure = layer.confirm("确定删除实验？",
					{title:'提示', area:['280px','190px']},
					function(){_this.delExp(row)});
			},

			delExp(row){
				//console.log(row.id);
				var api = global_.exp_delete;
				let data = {
					'id': row.id
				};

				this.$http.post(api, data).then((resp)=>{
					//console.log(resp);
					layer.alert('删除成功', {title:'提示', area:['280px','190px']});
					this.reqData(this.search_state, this.curPage);

				}, (err)=>{
					layer.alert('实验有考核，删除失败');
					console.log(err);
				});	
			},
		    
		    // request one page 
		    reqData(keyword, page){
			    //list request
			    var list_api = global_.exp_list
							 + '?page=' 
							 + page 
							 + '&pagesize=' 
							 + this.rowsPerPage;

				let req_data = {
					"search": {
						"name": keyword
					}
				};

			    this.$http.post(list_api, req_data).then((resp)=>{
			    	//console.log(resp);

			    	//this.totalRows = resp.body.total;
			    	this.$store.commit('sign', this.mod_name);
			    	this.$store.commit('setRowNumBefore', resp.body.total);
			    	this.$store.commit('setRowNumAfter', resp.body.total);
			    	this.$store.commit('setRowsPerPage', this.rowsPerPage);
			    	
			    	this.totalPage = resp.body.total_page;
			    	this.tableData = resp.body._list;
			    	this.filterData(page);
			    	layer.close(this.loading);

			    }, (err)=>{
			    	Utils.lalert('数据请求失败');
			      	console.log(err);
			      	layer.close(this.loading);
			    });  	
		     },

		     searchReq(){
		     	this.reqData(this.search_state, 1);
		     },

		     invokeSearch(e){
		     	//hit enter to invoke search
		     	if(e.keyCode == 13) {
		     		this.searchReq();
		     	}
		     }

		},
		
		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
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

			this.reqData(this.search_state, this.curPage);
			//layer.close(this.loading);
		}
	}
</script>


<style type="text/css" scoped>
.exp-searchwindow {
    position: relative;
    top: -4px;
}
</style>