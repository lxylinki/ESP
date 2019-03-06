<template>
	<div id="reportscore">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>报告成绩</span>
		</div>	

		<div style="height: 20px;"></div>

		<div class="selectclass">
			<div class="pick-class-title">班级：</div>	
			<div class="class-picker">
				<SearchSelect v-bind:items="class_options"
							  @makechoice="filterByClass"></SearchSelect>
			</div>	

			<div class="pick-report-title">报告：</div>	
			<div class="report-picker">
				<SearchSelect v-bind:items="report_options"
							  @makechoice="filterByReport"></SearchSelect>
			</div>	

			<div class="pick-if-failed">是否通过： </div>
			<div class="failed-picker">
				  <el-select v-model="failed_value" placeholder="请选择是否通过" v-on:change="loadPage(1)">
				    <el-option
				      v-for="item in failed_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
			</div>

		</div>	

		<div>
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
		    :data="list"
		    :row-class-name="row_name"
		    style="width: 100%;">
		    
			<el-table-column
			  label="序号"
			  :formatter="formatter"
			  min-width="50">
			</el-table-column>
		    
		    <el-table-column
		      prop="report_name"
		      label="报告名称"
		      min-width="120"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    	    
		    <el-table-column
		      prop="student_name"
		      label="学生姓名"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="class_name"
		      label="所属班级"
		      min-width="100">
		    </el-table-column>

		    <!--
		    <el-table-column
		      prop=""
		      label="参加次数"
		      min-width="100">
		    </el-table-column>-->

		    <el-table-column
		      prop="submit_times"
		      label="提交次数"
		      min-width="100">
		    </el-table-column>

		    <!--
		    <el-table-column
		      prop="submit_time"
		      label="提交时间"
		      min-width="100">
		    </el-table-column>-->

		    <el-table-column
		      prop="score"
		      label="得分"
		      min-width="100">
		    </el-table-column>	

		    <el-table-column
		      prop=""
		      label="是否通过"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.failed == 0">已通过</span>
		      	<span v-if="scope.row.failed == 1">未通过</span>
		      </template>
		    </el-table-column>	

		    <el-table-column
		      prop="update_time"
		      label="更新时间"
		      min-width="100">
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
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	import NewPager from '@/components/NewPager.vue';
	import SearchSelect from '@/components/SearchSelect.vue';

	export default {
		components: {
			'NewPager': NewPager,
			'SearchSelect': SearchSelect
		},	
		data(){
			return {
				list:[],
				tableData:[],
				class_value: '',
				report_value: '',
				failed_value: '',
				student_value: '',
				class_options: [],
				report_options:[],
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
				failed_options: [
					{
						label: '全部',
						value: null
					},
					{
						label: '已通过',
						value: 0
					},
					{
						label: '未通过',
						value: 1
					},
				],
				rowsPerPage: 10,
				curPage: 1,
				totalPage: 0			
			}
		},

		methods: {
			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},

			//for el-table
			formatter(row, column ,cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1 + row.ridx);
			},

			reqStatsData(class_id, exam_id, failed, user_id, page){
				let api = global_.report_stats_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'match': {
						'class_id': class_id,
						'exam_id': exam_id,
						'falied': failed,
						'user_id': user_id
					}
				}
				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					
					for(let item of this.tableData) {
						item.report_name = resp.body.exams[item.exam_id].name;
						item.student_name = resp.body.users[item.user_id].realname;
						//item.class_name = resp.body.classes[item.class_id].name;
						item.submit_time = Utils.convTime(item.created_at);
						item.update_time = Utils.convTime(item.updated_at);
					}

					this.filterData(page);
					//console.log(resp);
				}, (err)=>{
					Utils.err_process.call(this, err, '请求报告成绩失败');
				});
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			},

			reqClassData(tkeyword, ckeyword, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqClassList.call(this, tkeyword, ckeyword, page);
	     			this.class_options = resp.body._list;
	     			this.class_options.unshift({id: null, class_name: '全部班级'});
	     			this.class_value = this.class_options[0].id;					
				}
			},

			reqReportData(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqAllReport.call(this);
					this.report_options = resp.body._list;
					this.report_options.unshift({id: null, name: '全部报告'});
	     			this.report_value = this.report_options[0].id;
				}
			},

			filterByClass(class_id) {
				this.class_value = class_id;
				this.loadPage(1);
			},

			filterByReport(exam_id) {
				this.report_value = exam_id;
				this.loadPage(1);
			},

			loadPage(page) {
				this.reqStatsData(this.class_value, this.report_value, this.failed_value, this.student_value, page);
			}
		},

		mounted(){
			Utils.page_check_status.call(this);
			this.reqStatsData(null, null, null, null, 1);
			this.reqClassData(null, null, 1);
			this.reqReportData();
		}	
	}
</script>

<style type="text/css" scoped>
.pick-class-title, .pick-report-title, .pick-if-failed {
	display: inline-block;
	line-height: 55px;
	vertical-align: middle;
}

.pick-report-title, .pick-if-failed {
	margin-left: 20px;
}

.class-picker, .report-picker, .failed-picker {
	display: inline-block;
}

.failed-picker {
	position: relative;
	top: 3px;
}
</style>