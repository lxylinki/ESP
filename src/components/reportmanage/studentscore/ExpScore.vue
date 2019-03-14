<template>
	<div id="student-expscore">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>实验报告成绩</span>
		</div>	

		<div style="height: 20px;"></div>

		<div class="selectclass">
			<div class="pick-status-title">状态： </div>
			<div style="display: inline-block;">
				  <el-select v-model="status_value" placeholder="请选择状态" v-on:change="filterReport()">
				    <el-option
				      v-for="item in status_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>		
			</div>

			<div class="searchwindow student-score-searchwindow">
				<el-input class="searchinput student-score-searchinput" 
						  v-model="search_state"
						  v-on:keydown.native=""
						  placeholder="请搜索报告名称">		  
				</el-input>
				<button class="searchbtn report-searchbtn" v-on:click="">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
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
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column> 
		    
		    <!--
		    <el-table-column
		      prop=""
		      label="提交时间"
		      min-width="100">
		    </el-table-column>    

		    <el-table-column
		      prop=""
		      label="批改时间"
		      min-width="100">
		    </el-table-column>-->  

		    <el-table-column
		      prop="full_score"
		      label="总分"
		      min-width="100">
		    </el-table-column> 

		    <el-table-column
		      prop="score"
		      label="得分"
		      min-width="100">
		    </el-table-column>
			
		    <el-table-column
		      prop=""
		      label="状态"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.failed == 0">已通过</span>
		      	<span v-if="scope.row.failed == 1" >未通过</span>
		      </template>		      
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="操作"
		      min-width="100">
			  <template slot-scope="scope">
				<el-button class="op" type="text" @click="">
					查看
				</el-button>
			  </template>		 
		    </el-table-column>

			</el-table>
		</template>

	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	export default {
		data(){
			return {
				list: [],
				tableData: [],
				status_value: '',
				search_state: '',
				status_options: [],
				curPage: 1,
				rowsPerPage: 10
			}
		},

		methods: {
			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},
			//for el-table
			formatter(row, column ,cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1+ row.ridx);
			},

			reqScoreList(page){
				let api = global_.report_myscore
     				   + '?page='
     				   + page
     				   + '&pagesize='
     				   + this.rowsPerPage;	
     				   			
				this.$http.post(api, {}).then((resp)=>{
					this.tableData = resp.body._list;
					for(let item of this.tableData) {
						item.report_name = resp.body.exams[item.exam_id].name;
						item.full_score = resp.body.exams[item.exam_id].full_score;
					}
					this.filterData(page);
					//console.log(resp);
				}, (err)=>{
					Utils.err_process.call(this, err, '请求报告成绩列表失败');
				});
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			}
		},

		mounted(){
			this.reqScoreList(1);
		}
	}
</script>

<style type="text/css" scoped>
.pick-status-title {
	display: inline-block; 
	line-height: 60px;
}		

.student-score-searchwindow {
    position: relative;
    top: -7px;
}
</style>