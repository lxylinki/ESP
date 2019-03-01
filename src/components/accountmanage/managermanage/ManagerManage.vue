<template>
	<div id='managermanage'>
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			管理员管理
		</div>


		<div style="height: 20px;"></div>


		<div class="selectclass">
			<!--<div style="display: inline-block; width: 20px;"></div>-->

			<div class="statustitle">状态：</div>
			
			<div style="display: inline-block;">
				  <el-select v-model="status_value" placeholder="请选择" v-on:change="filterStatus()">
				    <el-option
				      v-for="item in status_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			</div>

			<div class="searchwindow mngm-searchwindow">
				<el-input class="manager-searchinput" v-model="search_state" v-on:keydown.native="invokeSearch($event)" placeholder="请搜索用户名"></el-input>
				<button class="searchbtn" v-on:click="searchReq(curPage)">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>

		</div>

		<div style="height: 20px;"></div>

		<div  style="display: inline-block;">
			<el-button class="addbtn" v-on:click="addManager()">添加</el-button>
		</div>

		<!--choose rows per page-->
		<div style="display: inline-block; float: right; margin: 0px;">
			<span>显示 </span>
				<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 28px;">
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
		      prop="user_id"
		      label="ID"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="school_name"
		      label="学校名称"
		      min-width="100">
		    </el-table-column>
		    <el-table-column
		      prop="realname"
		      label="真实姓名"
		      min-width="100">
		    </el-table-column>
		    
		    <el-table-column
		      prop="username"
		      label="用户名"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">
		      	<el-button  class="op" type="text" @click="editRow(scope.row)">
		      		<i class="iconfont">&#xe61a;</i>编辑
		      	</el-button>
		      	<!--<el-button type="text" @click="tableData.splice(scope.$index, 1)">-->
		      	<!--	
		      		<el-button class="op" type="text" @click="deleteRow(scope.row)">
		      		<i class="iconfont">&#xe7e0;</i>删除
		      	</el-button>-->

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
	import Utils from '../../Utils.js';
	import store from '@/vuex/store.js';
	import global_ from '../../Global.js';
	import NewPager from '../../NewPager.vue';

	export default {
		components: {
			//name is Pager here
			'NewPager': NewPager
		},
		
		store: store,

		data(){
			return {	
				mod_name: 'manager-manage',
				//to store table data
				list:[],
				dataChanged: false,
				status_value: null,
				search_state: '',
				status_options: [
					{
						label: '全部',
						value: null
					},
					{
						label: '启用',
						value: 1
					},
					{
						label: '失效',
						value: 0
					}
				],

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
				loading: null
			}
		},

		methods: {
			invokeSearch(e){
		     	if(e.keyCode == 13) {
		     		//this.searchReq(this.curPage);
		     		this.searchReq(1);
		     	}
		    },

		    searchReq(page) {
		    	asyncReq.call(this);
		    	async function asyncReq(){
		    		let searchRes1 = await this.reqMngList( this.search_state,'', '', page);
		    		this.totalPage = searchRes1.body.total_page;
		    		this.tableData = searchRes1.body._list;
		    		this.filterData(page);
		    	}
		    },

			reqMngList(usr_name, real_name, sch_name, page){
				return new Promise((resolve, reject)=>{
					var api = global_.manager_list
							 + '?page=' 
							 + page 
							 + '&pagesize=' 
							 + this.rowsPerPage;
					// status null: all
					let data = {
						'status': this.status_value,
						'gender': this.gender,
						'search': {
							'username': usr_name,
							'realname': real_name,
							'school_name':sch_name
						}
					}
					this.$http.post(api, data).then((resp)=>{
						//console.log(resp);
						layer.close(this.loading);
						resolve(resp);
						
					},(err)=>{
						Utils.lalert('请求管理员列表失败');
						console.log(err);
						layer.close(this.loading);
					});
				});
			},

			// no search keyword
			reqData(usr_name, real_name, sch_name, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await this.reqMngList(usr_name, real_name, sch_name, page);

					this.$store.commit('sign', this.mod_name);
			    	this.$store.commit('setRowNumBefore', resp.body.total);
			    	this.$store.commit('setRowNumAfter', resp.body.total);
			    	this.$store.commit('setRowsPerPage', this.rowsPerPage);

					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					this.filterData(page);
				}
			},

			editRow(row){
				//console.log(row);
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$router.push('/manageredit');
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			},

			pageSizeChange(){
				//refresh data
				//this.reqData('','','', 1);
				this.searchReq(1);
			},

			loadPage(page){
				//this.reqData('','','', page);
				this.searchReq(page);
			},

			addManager(){
				this.$router.push('/manageradd');
			},

			filterStatus(){
				this.reqData(this.search_state,'','', 1);
			}

		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},
		
		mounted(){
			Utils.page_check_status.call(this);
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

			this.reqData('', '', '', this.curPage);
			//layer.close(this.loading);

		}
	}
</script>


<style type="text/css" scoped>

/*
.selectclass {
	height: 80px;
	background: #cccccc;
}*/

.statustitle {
	display: inline-block; 
	line-height: 60px;
}

.mngm-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0px;
}

/* operations text buttons */
 .op{
  	position: relative;
  	bottom: 8px;
  	vertical-align: top;
  	line-height: 0;
  }  	

</style>