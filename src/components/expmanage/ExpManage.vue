<template>
	<div id='expmanage'>
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">实验管理</span>
		</div>

		<!--<button @click="fn">弹出</button>-->

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

			<!--
		    <div class="allcatags" style="display: inline-block;">
		    	<div class="select-header select-header-normal">
			    	<input type="text" class="select-header-text" placeholder="请搜索实验分类名称"  v-on:focus="showToggle=true" v-model="catag_search_state"></input>
					<i class="iconfont togglesign" v-on:click="toggleList()" v-show="!showToggle">&#xe607;</i>
					<i class="iconfont togglesign" v-on:click="toggleList()" v-show="showToggle">&#xe608;</i>
		    	</div>

				<div class="select-list" v-show="showToggle" style="overflow-y: scroll; height: 190px;">
					<li class="select-item" v-bind:class="{leafcatag: item.isleaf, rootcatag: item.isroot, midcatag: item.ismid}" v-for="item in filtered_catags" v-on:click="makeChoice(item)">{{item.name}}</li>	
				</div>
		    </div> -->

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
		      prop="teachers"
		      label="老师"
		       min-width="100">
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
		      	<el-button  class="op" type="text" @click="">
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
				loading: null																			
			}
		},

		methods: {
			addExp(){
				this.$router.push('/expadd');
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
		    reqData(cid, keyword, page, ugroup){
		    	let api_prefix = global_.exp_list;
		    	//console.log(api_prefix);

		    	if(ugroup == global_.teacher_group){
		    		api_prefix = global_.exp_tlist;
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
			    		console.log(item);
			    		item.create_time = Utils.convTime(item.created_at);
			    		item.update_time = Utils.convTime(item.updated_at);

			    		if(Object.keys(resp.body.categories).includes(item.cid)){
			    			item.catag_belong = resp.body.categories[item.cid].name;
			    		}			    		
			    	}

			    	this.filterData(page);
			    	layer.close(this.loading);

			    }, (err)=>{
			    	Utils.lalert('数据请求失败');
			      	console.log(err);
			      	layer.close(this.loading);
			    });  	
		     },

		     filterExp(){
		     	this.reqList(this.catag_value, null, 1);
		     },

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
					console.log(err);
					//Utils.err_process.call(this, err, '请求实验分类列表失败');
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
				if(after > before) {
					this.curPage = Math.ceil(after / this.rowsPerPage);	

				} else if(curpage > 0) {
					this.curPage = curpage;
				} 				
			}

			this.reqCatagList();
			this.reqList(null, this.search_state, this.curPage);
		}
	}
</script>


<style type="text/css" scoped>
.exp-searchwindow {
    position: relative;
    top: -4px;
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
</style>