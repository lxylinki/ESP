<template>
	<div id="reportrecord">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>报告记录</span>
		</div>

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
			<!--
			<div class="searchwindow report-rec-searchwindow">
				<el-input class="searchinput report-rec-searchinput" 
						  v-model="search_state"
						  v-on:keydown.native=""
						  placeholder="请搜索报告名称">		  
				</el-input>
				<button class="searchbtn report-searchbtn" v-on:click="filterReport()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>-->	
		</div>


		<div style="">
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
		      prop="exam_name"
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

		    <el-table-column
		      prop="submit_time"
		      label="提交时间"
		      min-width="120">
		    </el-table-column>

		    <el-table-column
		      prop="grade_time"
		      label="批改时间"
		      min-width="120">
		    </el-table-column>

		    <!--
		    <el-table-column
		      prop="score"
		      label="总分"
		      min-width="100">
		    </el-table-column>-->

		    <el-table-column
		      prop="score"
		      label="得分"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="!scope.row.submitted_at">未提交</span>
		      	<span v-else>{{scope.row.score}}</span>
		      </template>
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="批改人"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="状态"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="!scope.row.marked_at">未批改</span>
		      	<span v-else>已批改</span>
		      </template>
		    </el-table-column>

		    <el-table-column
		      label="操作"
		      min-width="100">
		      <template slot-scope="scope">
		      	<el-button class="op" v-bind:disabled="scope.row.marked_at" type="text" @click="gradeReport(scope.row)">
		      		批改
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
				mod_name: 'report-rec',
				list: [],
				tableData: [],
				rowsPerPage: 10,
				class_value: '',
				report_value: '',
				student_value: '',
				marked_value: '',
				search_state: '',
				curPage: 1,
				totalPage: 0,
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
			}
		},
		methods:{
			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},

			//for el-table
			formatter(row, column ,cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1 + row.ridx);
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

			reqRecList(class_id, exam_id, user_id, has_marked, page){
				let api = global_.report_rec_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'match': {
						'class_id': class_id,
						'exam_id': exam_id,
						'user_id': user_id,
						'has_marked': has_marked
					}
				}

				this.$http.post(api, data).then((resp)=>{
					this.totalPage = resp.body.total_page;
					this.tableData = resp.body._list;
					for(let item of this.tableData) {
						item.exam_name = resp.body.exams[item.exam_id].name;
						item.student_name = resp.body.users[item.user_id].realname;
						//item.class_name = resp.body.classes[item.class_id].name;
						item.submit_time = Utils.convTime(item.joined_at);
						item.grade_time = Utils.convTime(item.marked_at);
					}
					this.filterData(page);
					console.log(resp);

				}, (err)=>{
					Utils.err_process.call(this, err, '请求报告记录列表失败');
				});
			},

			filterData(page){
				this.list = this.tableData;
				this.curPage = page;
			},

			loadPage(page) {
				this.reqRecList(this.class_value, this.report_value, this.student_value, this.marked_value, page);
			},

			pageSizeChange(){
				this.loadPage(1);
			},

			filterByClass(class_id) {
				this.class_value = class_id;
				this.loadPage(1);
			},

			filterByReport(exam_id) {
				this.report_value = exam_id;
				this.loadPage(1);
			},

			gradeReport(row) {
				//console.log(row);
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$router.push('/reportgrade');
			}		
		},

		mounted(){
			Utils.page_check_status.call(this);
			this.reqClassData(null, null, 1);
			this.reqReportData();
			this.reqRecList(null, null, null, null, 1);
		}
	}
</script>

<style type="text/css" scoped>
.pick-class-title, .pick-report-title {
	display: inline-block;
	line-height: 60px;
}

.pick-report-title {
	margin-left: 20px;
}

.class-picker, .report-picker {
	display: inline-block;
}

.report-rec-searchwindow {
    position: relative;
    top: -7px;
    margin: 20px 20px 0 20px;
}

</style>