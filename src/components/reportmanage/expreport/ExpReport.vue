<template>
	<div id="expreport">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>实验报告</span>
		</div>	

		<div style="height: 20px;"></div>

		<div class="selectclass">
			
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
			</div>

			<div class="searchwindow report-searchwindow">
				<el-input class="searchinput report-searchinput" 
						  v-model="search_state"
						  v-on:keydown.native=""
						  placeholder="请搜索模板名称">		  
				</el-input>
				<button class="searchbtn report-searchbtn" v-on:click="">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>
		</div>	

		<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addReport()">添加</el-button>
			</div>

			<div style="display: inline-block; float: right; margin: 10px;">
				<span>显示 </span>
					<select v-model="rowsPerPage" v-on:change="" style="width: 60px; height: 25px;">
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
		      label="实验名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    	    
		    <el-table-column
		      prop="start_time"
		      label="开始时间"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="end_time"
		      label="截止时间"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="full_score"
		      label="总分"
		      min-width="100">
		    </el-table-column>

		    <!--
		    <el-table-column
		      prop=""
		      label="创建人"
		      min-width="100">
		    </el-table-column> -->

		    <el-table-column
		      prop="status"
		      label="状态"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.status == 0">未发布</span>
		      	<span v-if="scope.row.status == 1">已发布</span>
		      	<span v-if="scope.row.status == 2">已关闭</span>
		      	<span v-if="scope.row.status == 3">成绩公布</span>
		      </template>
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

		      	<el-button v-show="scope.row.status==0" class="op" type="text" @click="pubReport(scope.row)">
		      		发布
		      	</el-button>
		      	<el-button v-show="scope.row.status==0" class="op" type="text" @click="deleteRow(scope.row)">
		      		删除
		      	</el-button>
		      	<el-button v-show="scope.row.status==1" class="op" type="text" @click="closeExam(scope.row)">
		      		关闭考试
		      	</el-button>
		      	<el-button v-show="scope.row.status==2" class="op" type="text" @click="">
		      		成绩公布
		      	</el-button>

		      </template>
		    </el-table-column>

		  </el-table>
		</template>

	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	export default {
		data(){
			return {
				list: [],
				tableData: [],
				curPage: 1,
				status_value: '',
				status_options: [],
				search_state: '',
				rowsPerPage: 10,
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
			reqReportList(page){
				let api = global_.report_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {

				}

				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
					this.tableData = resp.body._list;
					for(let item of this.tableData) {
						item.start_time = Utils.convTime(item.started_at);
						item.end_time = Utils.convTime(item.ended_at);
					}
					this.filterData(page);
				}, (err)=>{
					Utils.err_process.call(this, err, '请求实验报告列表失败');
				});
			},

			filterData(page){
				this.list = this.tableData;
				this.curPage = page;
			},

			addReport(){
				this.$router.push('/reportadd');
			},

			pubReport(row){
				//console.log(row);
				let api = global_.report_pub;
				let data = {
					'exam_id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
					this.reqReportList(this.curPage);
				}, (err)=>{
					Utils.err_process.call(this, err, '实验报告发布失败');
				});
			},

  			deleteRow(row) {
  				var _this = this;
  				Utils.lconfirm("确定删除实验报告？", function(){_this.delReport(row)});
  			},

  			delReport(row) {
  				let api = global_.report_delete;
  				let data = {
  					'exam_id': row.id
  				}
				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
					Utils.lalert('删除实验报告成功');
					this.reqReportList(this.curPage);
				}, (err)=>{
					Utils.err_process.call(this, err, '实验报告删除失败');
				});  				
  			},

  			closeExam(row) {
  				let api = global_.report_exam_close;
  				let data = {
  					'id': row.id
  				}
				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
					Utils.lalert('关闭考试成功');
					this.reqReportList(this.curPage);
				}, (err)=>{
					Utils.err_process.call(this, err, '考试关闭失败');
				});   				
  			}
		},

		mounted(){
			this.reqReportList(1);
		}
	}
</script>

<style type="text/css">
.pick-status-title {
	display: inline-block; 
	line-height: 60px;
}	
.report-searchwindow {
    position: relative;
    top: -7px;
}
</style>