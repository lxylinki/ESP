<template>
	<div id='expmanage'>
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			实验管理
		</div>

		<div style="height: 20px;"></div>
		<div class="selectclass">
			<div class="statustitle">分类：</div>
			
			<div style="display: inline-block;">
				<el-select v-model="catag_value" v-on:change="filterExp()" placeholder="请搜索实验分类名称" filterable>
					<el-option
					  v-for="item in catag_options"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id"
					  :class="{leafcatag: item.isleaf, midcatag: item.ismid, unselectable: item.isleaf}">
					</el-option>
				</el-select>
			</div>

			<div class="searchwindow exp-searchwindow">
				<el-input class="searchinput exp-searchinput" 
						  v-model="search_state"
						  v-on:keydown.native="invokeSearch($event)"
						  placeholder="请搜索实验名称">		  
				</el-input>
				<button class="searchbtn exp-searchbtn" v-on:click="searchReq()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>

		</div>

		<div style="height: 10px;"></div>

		<!--choose rows per page-->
		<div style="display: inline-block; float: right; margin-bottom: 10px;">
			<span>显示 </span>
				<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 25px;">
					<option v-for="item in row_nums" v-bind:value="item.value">
						{{item.label}}
					</option>
				</select>
			<span> 条</span>
		</div>

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
		      prop="catag_belong"
		      label="所属分类"
		      min-width="100">
		    </el-table-column>
		    
		     <el-table-column
		      label="老师"
		       min-width="100"
		       :show-overflow-tooltip="true">
		       <template slot-scope="scope">
		       	<span v-for="teacher in scope.row.teachers">{{teacher.realname}}&nbsp;</span>
		       </template>
		    </el-table-column>

		     <el-table-column
		      prop="create_time"
		      label="创建时间"
		       min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop="update_time"
		      label="更新时间"
		       min-width="100">
		    </el-table-column>


		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">
		      	<el-button  class="op" type="text" @click="grantTeachers(scope.row)">
		      		授权老师
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


<!--------------------------------------------------------------------------------------------------------------------------------------------------------->
		<div id="show-all-teachers" v-show="false">
			
			<div class="selectclass">
				<div class="exp-name"><span>{{exp_name}}</span></div>
				<div class="searchwindow">
					<el-input class="searchinput tchr-searchinput" v-model="t_search_state" placeholder="请搜索真实姓名" v-on:keydown.native="t_invokeSearch($event)"></el-input>
					<button class="searchbtn" v-on:click="t_searchReq()"><i style="color: white;" class="el-icon-search"></i></button>
				</div>
			</div>

			<template>
			  <el-table
			    class="tchr-list"
			    @row-click="clickRow"
			    :data="tlist"
			    :highlight-current-row="true"
			    style="width: 100%;">
			    <el-table-column
			      prop="realname"
			      label="真实姓名"
			      min-width="200">
			    </el-table-column>

			    <el-table-column
			      prop="username"
			      label="用户名"
			      min-width="200">
			    </el-table-column>

			    <el-table-column
			      prop="operation"
			      label="操作"
			      min-width="200">
			      <template slot-scope="scope">
			      	<i class="iconfont unchecked-box" v-show="!focus_tids.includes(scope.row.user_id)">&#xe63c;</i>
			      	<i class="iconfont checked-box" v-show="focus_tids.includes(scope.row.user_id)">&#xe63e;</i>
			      </template>
			    </el-table-column>

			  </el-table>
			</template>				

	   		<NewPager v-bind:current_page='t_curPage' 
	   	           	  v-bind:pages='t_totalPage'
	   		          @setPage='t_loadPage'
	   		       ></NewPager>

			<div style="height: 30px;"></div>
			<div class="btn-group">
				<el-button class="confirm" v-on:click="updateTeachers()">确定</el-button>
				<el-button class="goback" v-on:click="cancel()">取消</el-button>
			</div>

		</div><!--end show all teachers-->

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
				catag_value: '',
				value: '',
				search_state: '',
				options: [],
				catag_options: [],

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
				loading: null,
				exp_name: '',
				layeridx: null,
				tlist:[],
				t_totalPage: 0,
				t_curPage: 1,
				t_search_state: '',
				focus_tids: [],
				orig_tids: [],
				t_rowsPerPage: 10																		
			}
		},

		methods: {
			addExp(){
				this.$router.push('/expadd');
			},

			grantTeachers(row){
				/*
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$router.push('/expconfig');*/
				this.exp_name = row.name;
				this.exp_id = row.eid;
				this.focus_tids = [];
				this.orig_tids = [];
				//existing teachers
				if(row.teachers.length > 0) {
					for(let teacher of row.teachers) {
						this.focus_tids.push(teacher.id);
						this.orig_tids.push(teacher.id);
					}					
				}

				this.t_loadPage(1);
				//console.log(row);
				this.layeridx = layer.open({
					type: 1,
					area: ['700px', '765px'],
					title: '',
					content: $('#show-all-teachers')
				});	
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			},

			pageSizeChange(){
				//reload data
				//this.filterData(this.curPage);
				this.reqList(this.catag_value, this.search_state, this.curPage);
			},

			loadPage(page){
				//console.log('load page ' + page);
				this.reqList(this.catag_value, this.search_state, page);
			},
		    
		    // request one page
		    reqData(cid, keyword, page, ugroup){
		    	let api_prefix = global_.exp_list;
		    	//console.log(api_prefix);

		    	if(ugroup == global_.teacher_group){
		    		api_prefix = global_.exp_tlist;
		    		
		    	} else if (ugroup == global_.student_group){
		    		api_prefix = global_.exp_slist;

		    	}

		    	/*
		    	if(ugroup == global_.student_group){
		    		api_prefix = global_.exp_stlist;
		    	}*/

		    	//console.log(api_prefix);
			    //role-based api
			    //console.log(api_prefix);
			    var list_api = api_prefix
							 + '?page=' 
							 + page 
							 + '&pagesize=' 
							 + this.rowsPerPage;
				//console.log(list_api);
				
				let req_data = {
					"cid": cid,
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

			    	for(let item of this.tableData) {
			    		//console.log(item.teachers);
			    		item.create_time = Utils.convTime(item.created_at);
			    		item.update_time = Utils.convTime(item.updated_at);

			    		if(Object.keys(resp.body.categories).includes(item.cid)){
			    			item.catag_belong = resp.body.categories[item.cid].name;
			    		}			    		
			    	}
			    	this.filterData(page);
			    	layer.close(this.loading);

			    }, (err)=>{
			    	Utils.err_process.call(this, err, '请求实验列表失败'); 
			    });  	
		     },

		     filterExp(){
		     	this.reqList(this.catag_value, this.search_state, 1);
		     },

		     //req exp list
		     reqList(cid, keyword, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.page_check_status.call(this);
					let ugroup = resp.body.group;
					this.reqData(cid, keyword, page, ugroup);
				}		     	
		     },

		     searchReq(){
		     	this.reqList(this.catag_value, this.search_state, 1);
		     },

		     invokeSearch(e){
		     	//hit enter to invoke search
		     	if(e.keyCode == 13) {
		     		this.searchReq();
		     	}
		     },

			reqCatagList(){
				//console.log(this.catag_options);
				this.catag_options = [];
				let api = global_.expcatag_list;
				let data = {
					'all': 1
				}
				this.$http.post(api, data).then((resp)=>{
					this.expandCatag(this.catag_options, resp.body);				
					this.filtered_catags = this.catag_options;
					this.filtered_catags.unshift({'id': null, 'name': '全部分类'});

				}, (err)=>{
					//console.log(err);
					Utils.err_process.call(this, err, '请求实验分类列表失败');
				});				
			},

			expandCatag(arr, tree){
				for(let i of tree) {
					if(i.level == -1 && i.pid) {
						i.isleaf = true;
					} else if(i.level == 1) {
						i.isroot = true;
					} else if(i.level == 2) {
						i.ismid = true;
					}
					arr.push(i);
					if(i.hasOwnProperty('sub_categories')) {
						this.expandCatag(arr, i.sub_categories)
					}
				}
			},

/*-----------------------------------------------------------------------------------------------*/
			reqTeacherData(keyword, page){
				//list request
				var list_api = global_.teacher_list
							 + '?page=' 
							 + page 
							 + '&pagesize=' 
							 + this.t_rowsPerPage;

				let req_data = {
					'status': this.status_value,
				  	'search': {
				  		'username': '',
				  		'realname': keyword
				  	}
				}

				this.$http.post(list_api, req_data).then((resp)=>{
					//console.log(resp);
					this.t_totalPage = resp.body.total_page;
					this.tlist = resp.body._list;
					this.t_curPage = page;

				},(err)=>{
					Utils.err_process.call(this, err, '请求教师列表失败'); 
				});
			},

			t_loadPage(page) {
				this.reqTeacherData(this.t_search_state, page);
			},

			t_invokeSearch(e){
				if(e.keyCode == 13) {
					this.t_searchReq();
				}
			},

			t_searchReq(){
				this.reqTeacherData(this.t_search_state, 1);
			},

			clickRow(trow) {
				if(!this.focus_tids.includes(trow.user_id)) {
					this.focus_tids.push(trow.user_id);

				} else {
					let idx = this.focus_tids.indexOf(trow.user_id);
					if(idx != -1) {
						this.focus_tids.splice(idx, 1);
					}					
				}				
			},

			/*
			selectRow(trow){
				if(!this.focus_tids.includes(trow.user_id)) {
					this.focus_tids.push(trow.user_id);
				}
			},

			removeRow(trow){
				let idx = this.focus_tids.indexOf(trow.user_id);
				if(idx != -1) {
					this.focus_tids.splice(idx, 1);
				}
			},*/

			rmTeachers(eid, user_ids){
				return new Promise((resolve, reject)=>{
					let del_api = global_.exp_teacher_delete;
					let data = {
						"eid": eid,
						"user_ids": user_ids
					}
					this.$http.post(del_api, data).then((resp)=>{
						resolve(resp);
					}, (err)=>{
						Utils.err_process.call(this, err, '移除教师失败');
					});
				});
			},

			addTeachers(eid, user_ids) {
				return new Promise((resolve, reject)=>{
					let add_api = global_.exp_teacher_add;
					let data = {
						"eid": eid,
						"user_ids": user_ids
					}
					this.$http.post(add_api, data).then((resp)=>{
						resolve(resp);
					}, (err)=>{
						Utils.err_process.call(this, err, '添加教师失败');
					});
				});
			},

			//from orig tids to current tids:
			//remove if any then add if any
			updateTeachers(){
				let toRemove = this.orig_tids.filter(item => !this.focus_tids.includes(item)),
				    toAdd = this.focus_tids.filter(item => !this.orig_tids.includes(item)),
				    del_api = global_.exp_teacher_delete,
					add_api = global_.exp_teacher_add;

				if(toRemove.length > 0 && toAdd.length > 0) {
					this.rmTeachers(this.exp_id, toRemove).then(this.addTeachers(this.exp_id, toAdd));

				} else if(toRemove.length > 0) {
					this.rmTeachers(this.exp_id, toRemove);

				} else if(toAdd.length > 0) {
					this.addTeachers(this.exp_id, toAdd);
				}

				//refresh page
				this.reqList(this.catag_value, this.search_state, this.curPage);
				layer.close(this.layeridx);
			},

			cancel(){
				layer.close(this.layeridx);
			}
		},
		
		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			Utils.page_check_status.call(this);
			let name = this.$store.state.last_author;
			//will disappear after page refresh...
			//this.user_group = this.$store.state.user_group;

			if(name === this.mod_name) {
				let before = this.$store.state.row_num_before,
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
				// or start?
				/*
				if(after > before) {
					this.curPage = Math.ceil(after / this.rowsPerPage);	

				} else if(curpage > 0) {
					this.curPage = curpage;
				} */
				this.curPage = 1;				
			}

			this.reqCatagList();
			this.reqList(null, '', this.curPage);
			//this.reqTeacherData(null, 1);
		}
	}
</script>


<style type="text/css" scoped>
#show-all-teachers .selectclass {
	background: white;
	height: 100px;
}

.exp-searchwindow {
    position: relative;
    top: -7px;
}

.statustitle {
	display: inline-block; 
	line-height: 60px;
}

.leafcatag {
	padding-left: 35px;
	color: #757575;
}

.midcatag {
	padding-left: 25px;
	color: #757575;
}

.exp-name {
	position: relative;
	text-align: center;
}

#show-all-teachers {
	padding: 20px;
	overflow: auto;
}

.btn-group {
	position: absolute;
	bottom: 30px;
	right: 30px;
}

.unchecked-box, .checked-box {
	color: #5c9cec;
	cursor: pointer;
	font-size: 180%;
}

/*modify the style of current row*/
#show-all-teachers .el-table >>> .el-table__body tr.current-row>td {
	background: #f0f7ff !important;
	color: #5c9cec;
}

/*hide hover effect*/
#show-all-teachers .el-table--enable-row-hover >>> .el-table__body tr:not(.current-row):hover>td{
	background-color: transparent !important;
}

/*
.goback, .goback:hover, .goback:active, .goback:focus{
	width:86px;
	height:38px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(204,204,204,1);
	border-radius:4px;
}

.confirm, .confirm:hover, .confirm:active, .confirm:focus{
	color: #ffffff;
	width:86px;
	height:38px;
	background:#5c9cec;
	border:1px solid #5c9cec;
	border-radius:4px;
}*/

.searchinput {
	width:200px;
	height:36px;
	background:rgba(255,255,255,1);
	border: none;
	border-radius:4px;
}

/*
.tchr-list {
	border: 1px solid red;
	top: 100px;
}*/
</style>