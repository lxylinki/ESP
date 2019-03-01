<template>
	<div id="reportmanage">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>模板管理</span>
		</div>	

		<div style="height: 20px;"></div>

		<div class="selectclass">
			<!--
			<div style="display: inline-block; width: 20px;"></div>
			<div class="pick-status-title">状态： </div>
			<div style="display: inline-block;">
				  <el-select v-model="status_value" placeholder="请选择状态" v-on:change="">
				    <el-option
				      v-for="item in status_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>		
			</div> -->

			<div class="searchwindow tpl-searchwindow">
				<el-input class="searchinput tpl-searchinput" 
						  v-model="search_state"
						  v-on:keydown.native="invokeSearch($event)"
						  placeholder="请搜索模板名称">		  
				</el-input>
				<button class="searchbtn tpl-searchbtn" v-on:click="searchReq()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>
		</div>

		<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addTpl()">添加</el-button>
			</div>

			<div style="display: inline-block; float: right; margin: 10px;">
				<span>显示 </span>
					<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 25px;">
						<option v-for="item in row_nums" v-bind:value="item.value">
							{{item.label}}
						</option>
					</select>
				<span> 条</span>
			</div>
		</div>


		<template>
		  <el-table
		    class="mytable"
		    :data="list"
		    style="width: 100%;">
		    <!--
			<el-table-column
			  label="序号"
			  type="index"
			  min-width="100">
			</el-table-column>-->
		    
		    <el-table-column
		      prop="name"
		      label="模板名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    	    
		    <el-table-column
		      prop="score"
		      label="总分"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="create_time"
		      label="创建时间"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="realname"
		      label="创建人"
		      min-width="100">
		    </el-table-column>

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

		
		<div style="height: 40px;"></div>
   		<NewPager v-bind:current_page='curPage' 
   	           	  v-bind:pages='totalPage'
   		          @setPage='loadPage'
   		       ></NewPager>

	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	import NewPager from '@/components/NewPager.vue';

	export default {
		components: {
			'NewPager': NewPager
		},

		data(){
			return {
				search_state:'',
				list: [],
				tableData: [],
				status_value: null,
				status_options: [],
				rowsPerPage: 10,
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
			}
		},

		methods: {
			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.reqTplList(this.search_state, 1);
				}
			},

			searchReq(){
				this.reqTplList(this.search_state, 1);
			},

			reqTplList(name, page){
				let api = global_.report_tpl_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'search':{
						'name': name
					}
				}

				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body._list;
					for(let item of this.tableData) {
						item.create_time = Utils.convTime(item.created_at);
					}
					this.totalPage = resp.body.total_page;
					this.filterData(page);
					//console.log(resp);

				}, (err)=>{
					Utils.err_process.call(this, err, '请求模板列表失败');
				});
			},

			addTpl(){
				this.$router.push('/tpladd');
			},

			loadPage(page){
				this.reqTplList(this.search_state, page);
			},

			filterData(page){
				this.list = this.tableData;
				this.curPage = page;
			},

			pageSizeChange(){
				this.reqTplList(this.search_state, 1);
			},

			deleteRow(row) {
				let _this = this;
				Utils.lconfirm("确定删除模板？", function(){_this.delTemplate(row)});
			},

			delTemplate(row) {
				//console.log(row);
				let api = global_.report_tpl_delete;
				let data = {
					'paper_id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除模板成功');
					this.loadPage(this.curPage);
				}, (err)=>{
					Utils.err_process.call(this, err, '删除模板失败');
				});
			}
		},

		mounted(){
			Utils.page_check_status.call(this);
			this.reqTplList(null, 1);
		}
	}	
</script>

<style type="text/css" scoped>
.pick-status-title {
	display: inline-block; 
	line-height: 60px;
}

.tpl-searchwindow {
    position: relative;
    top: -7px;
}
</style>