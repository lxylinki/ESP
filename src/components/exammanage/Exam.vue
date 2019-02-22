<template>
	<div id="exam">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			考核管理
		</div>
		<div style="height: 20px;"></div>

		<div class="selectclass">
			
			<div class="pickexptitle">实验： </div>
			<div style="display: inline-block;">
				  <el-select v-model="exp_value" filterable placeholder="请搜索实验名称" v-on:change="filterSearchData(1)">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.eid">
				    </el-option>
				  </el-select>		
			</div>
			<div style="display: inline-block; width: 20px;"></div>
			<div class="pickquestype">类型： </div>
			<div style="display: inline-block;">
				  <el-select v-model="type_value" placeholder="请选择考核类型" v-on:change="filterSearchData(1)">
				    <el-option
				      v-for="item in type_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
			</div>

			<div class="searchwindow exam-searchwindow">

				<el-input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索考核名称">
				</el-input>

				<button class="searchbtn"  v-on:click="filterSearchData(1)">
					<i style="color: white;" class="el-icon-search"></i>
				</button>

			</div>
		</div><!--selectclass-->

		<div style="display: flex; justify-content: flex-end; align-items: baseline;">
			<!--
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addExam()">添加</el-button>
			</div> -->

			<div style="margin-top: 20px;">
				<span>显示 </span>
					<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 25px;">
						<option v-for="item in row_nums" v-bind:value="item.value">
							{{item.label}}
						</option>
					</select>
				<span> 条</span>
			</div>
		</div>

		<div style="height: 20px;"></div>

		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">
		    <el-table-column
		      prop="name"
		      label="考核名称"
		      min-width="150"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    
		    <el-table-column
		      prop="experiment_name"
		      label="所属实验"
		      min-width="150">
		    </el-table-column>
		    
		    <!--		    
		     <el-table-column
		      prop="type"
		      label="题型"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.type == 1">单选</span>
		      	<span class="notinuse" v-if="scope.row.type == 2">多选</span>
		      </template>
		    </el-table-column>-->

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
		      prop="count"
		      label="题数限制"
		      min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop="type"
		      label="类型"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.type == 1">考核</span>
		      	<span v-if="scope.row.type == 2">抢救治疗</span>
		      </template>
		    </el-table-column>

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">
		      	<!--
		      	<el-button  class="op" type="text" @click="configRow(scope.row)">
		      		旧版配置试题
		      	</el-button> -->
		      	<el-button  class="op" type="text" @click="configQs(scope.row)">
		      		配置试题
		      	</el-button>
		      	<!--
		      	<el-button  class="op" type="text" @click="editRow(scope.row)">
		      		<i class="iconfont">&#xe61a;</i>编辑
		      	</el-button>
		      	<el-button class="op" type="text" @click="deleteRow(scope.row)">
		      		<i class="iconfont">&#xe7e0;</i>删除
		      	</el-button> -->
		      </template>
		    </el-table-column>

		  </el-table>
		</template>

		<div style="height: 40px;"></div>
   		<NewPager 	v-bind:current_page='curPage' 
   				v-bind:pages='totalPage'
   		       	@setPage='filterSearchData'></NewPager>		

	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import NewPager from '@/components/NewPager.vue';
	import global_ from '@/components/Global.js';

	export default {
		components: {
			'NewPager': NewPager
		},
		data(){
			return {
				list: [],
				tableData: [],
				exp_value: '',
				type_value: '',
				search_state: '',
				exp_options: [],
				rowsPerPage: 10,
				totalRow: 0,
				curPage: 1,
				type_options: [
					{
						label:'全部',
						value: null
					},
					{
						label: '考核',
						value: 1
					},
					{
						label: '抢救治疗',
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
			}
		},

		methods: {
			fillExpSelect(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this, '', 1);
					this.exp_options = resp.body._list;
					/*
					for(let item of this.exp_options) {
						console.log(item);
					}*/
					this.exp_options.unshift({'name': '所有实验', 'id': null});
				}
			},

			reqExamList(page){
				var api = global_.exam_list + '?page=1';
				this.$http.post(api, {}).then((resp)=>{
					this.totalRow = resp.body.total;
					var full_list_api = api + '&pagesize='+ this.totalRow;

					this.$http.post(full_list_api, {}).then((resp)=>{
				    	this.$store.commit('sign', this.mod_name);
				    	this.$store.commit('setRowNumBefore', resp.body.total);
				    	this.$store.commit('setRowNumAfter', resp.body.total);
						this.tableData = resp.body._list;

						let ekeys = Object.keys(resp.body.experiments);

						for(let item of this.tableData) {
							if(ekeys.includes(item.eid)) {
								item.experiment_name = resp.body.experiments[item.eid].name;
							}
							item.create_time = Utils.convTime(item.created_at);
							item.update_time = Utils.convTime(item.updated_at);
						}

						this.filterSearchData(page);
						layer.close(this.loading);

					}, (err)=>{
						layer.close(this.loading);
						Utils.err_process.call(this, err, '请求考核列表失败');
						console.log(err);
					});
				}, (err)=>{
					layer.close(this.loading);
					Utils.err_process.call(this, err, '请求考核列表失败');
					console.log(err);
				});			
			},

			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.filterSearchData(1);
				}
			},

			pageSizeChange(){
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.filterSearchData(1);
			},

			searchReq(data){
				var result = [];
				if(!this.search_state) {
					result = data;

				} else {
					result = data.filter( item => item.name.indexOf(this.search_state) != -1 );
				}
				//this.totalRow = result.length;
				return result;
			},

			filterSearchData(page){
				var search_res;

				//filter by type
				if (!this.type_value) {
					search_res = this.searchReq(this.tableData);

				} else {
					search_res = this.searchReq(this.tableData).filter(item => item.type == this.type_value);
				}
				this.totalRow = search_res.length;

				//filter by exp
				if(!this.exp_value) {
					this.list = search_res.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);

				} else {
					console.log(this.exp_value);
					var	search_exp_res = search_res.filter(item => item.eid == this.exp_value);
					this.list = search_exp_res.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
					this.totalRow = search_exp_res.length;
				}
				this.curPage = page;
			},

			addExam(){
				this.$router.push('/examadd');
			},

			//old ver
			/*
			configRow(row) {
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.$router.push('/examconfig');			
			},*/

			//new ver
			configQs(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.$router.push('/examquesconfig');
			},

			editRow(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.$router.push('/examedit');
			},

			deleteRow(row){
				var _this = this;
				Utils.lconfirm("确定删除考核？", function(){_this.delExam(row)});
			},

			delExam(row){
				var api = global_.exam_delete;
				let data = {
					'id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除考核成功');
					this.reqExamList(this.curPage);

				}, (err)=>{
					Utils.err_process.call(this, err, '删除考核失败');
				});				
			}
		},

		computed: {
			totalPage(){
				return Math.ceil(this.totalRow / this.rowsPerPage);
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
				//change to list start
				/*
				if(after > before) {
					this.curPage = Math.ceil(after / this.rowsPerPage);	

				} else if(curpage > 0) {
					this.curPage = curpage;
				}*/				
			}
			//console.log(before, after, pagesize, keyword, curpage);
			this.fillExpSelect();
			this.reqExamList(1);
		}
	}
</script>

<style type="text/css" scoped>

.pickexptitle {
	display: inline-block; 
	line-height: 60px;
}

.pickquestype {
	display: inline-block;
}

.exam-searchwindow {
    position: relative;
    top: -7px;	
}
</style>