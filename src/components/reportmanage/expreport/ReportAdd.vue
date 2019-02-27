<template>
	<div id="reportadd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>实验报告</span>
		</div>

		<div class="report-name-group">
			<div class="report-name-label">报告名称</div>
			<input class="report-name longinput" type="text" v-model="report_name" placeholder="必填">
			<span class="redalert" v-show="!report_name">*</span>
			<span class="whitedefault" v-show="report_name">*</span>
		</div>

		<div class="tpl-select-group">
			<div class="tpl-select-label">选择模板</div>
			<el-button class="tpl-select-link" type="text" v-on:click="showTplList()">
				<span v-show="!tpl_selected">选择模板</span><span v-show="tpl_selected">重新引用</span>
			</el-button>
		</div>

		<div class="display-area" v-show="tpl_selected">
			<span>名称：{{tpl_name}}</span><br><span>分数：{{score}}分</span>
		</div>

		<div class="time-group">
			<div class="time-label">开始时间</div>
			<input class="start-time" type="datetime-local" v-model="start_time"><span class="until">至</span>
			<input class="end-time" type="datetime-local" v-model="end_time">
			<div class="time-interval" v-show="start_time && end_time">{{interval(start_time, end_time)}}</div>
		</div>

		<div class="report-note-group">
			<div class="report-note-label">实验说明</div>
			<textarea class="report-note" v-model="report_note"></textarea>
		</div>

		<div class="btn-group">
			<el-button class="confirm" v-on:click="">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
		</div>

<!--------------------------------------------------------------------------------------------------------------------------->
		<div id="show-all-tpls" v-show="true">

			<div class="selectclass">
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

			<template>
			  <el-table
			    class="tpl-list"
			    @row-click="clickRow"
			    :data="list"
			    :highlight-current-row="true"
			    style="width: 100%;">

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
			      prop="operation"
			      label="操作"
			      min-width="100">
			      <template slot-scope="scope">
			      	<i class="iconfont unchecked-box" v-show="!row_selected(scope.row)">&#xe63c;</i>
			      	<i class="iconfont checked-box" v-show="row_selected(scope.row)">&#xe63e;</i>
			      </template>
			    </el-table-column>

			  </el-table>
			</template>

			<div style="height: 40px;"></div>
	   		<NewPager v-bind:current_page='curPage' 
	   	           	  v-bind:pages='totalPage'
	   		          @setPage='loadPage'
	   		       ></NewPager>

			<div class="tpl-btn-group">
				<el-button class="tpl-confirm" v-on:click="">确定</el-button>
				<el-button class="tpl-goback" v-on:click="">取消</el-button>
			</div>

		</div>
<!---------------------------------------------------------------------------------------------------------------------------->		
	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import NewPager from '@/components/NewPager.vue';
	import Utils from '@/components/Utils.js';

	export default {
		components: {
			'NewPager': NewPager
		},
		data(){
			return{
				list: [],
				tableData:[],
				totalPage: 0,
				curPage: 1,
				rowsPerPage: 10,
				search_state:'',
				tpl_choice: '',

				report_name: '',
				tpl_selected: true,
				score: 0,
				tpl_name: 'test',
				start_time: null,
				end_time: null,
				report_note: ''
			}
		},

		methods: {

			toSeconds(time_str){
				if(time_str) {
					return Date.parse(time_str) / 1000;
				}
			},

			//display in DMH
			toDayHourMin(seconds){
				let hours = Math.floor(seconds%(3600*24)),
					mins = Math.floor(seconds%3600),
					//time = Math.floor(seconds/(3600*24)) + "天" + Math.floor(hours/3600) + "时" + Math.floor(mins/60) + "分"+ seconds%60 + "秒";
					time = Math.floor(seconds/(3600*24)) + "天" + Math.floor(hours/3600) + "时" + Math.floor(mins/60) + "分";
				return time;
			},

			interval(start, end) {
				return this.toDayHourMin(this.toSeconds(end) - this.toSeconds(start));
			},

			goBack(){
				this.$router.go(-1);
			},

/*--------------------------------------------------------------------------------------------------------------------*/
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

			loadPage(page){
				this.reqTplList(this.search_state, page);
			},

			filterData(page){
				this.list = this.tableData;
				this.curPage = page;
			},

			clickRow(row) {
				//console.log(row);
				this.tpl_choice = row.id;
			},

			row_selected(row) {
				return this.tpl_choice == row.id;
			}
		},

		mounted(){
			this.reqTplList(null, 1);
		}
	}
</script>

<style type="text/css" scoped>

.report-name {
	box-sizing: border-box;
	width:500px;
	height:36px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,0.5);
	border-radius:4px;
}

.start-time, .end-time {
	width:180px;
	height:36px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,0.5);
	border-radius:4px;
	padding-left: 15px;
}

.time-label, .start-time, .end-time, .time-interval {
	display: inline-block;
}

.time-interval {
	font-size: 14px;
	margin-left: 30px;
	color: rgba(153,153,153,1);
}

.until {
	margin-right: 15px;
	margin-left: 15px;
}

.report-name-label, .report-name, .tpl-select-label, .tpl-select-link, 
.report-note-label {
	display: inline-block;
}

.report-note-label {
	vertical-align: top;
}

.report-name-label, .tpl-select-label, .time-label, .report-note-label {
	margin-left: 30px;
	margin-right: 30px;
}

.report-note {
	box-sizing: border-box;
	padding: 15px;
	width:500px;
	height:100px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,0.5);
	border-radius:4px;
	display: inline-block;	
}

.display-area {
	width:260px;
	height:54px;
	background:rgba(241,241,241,1);
	margin-left: 130px;
	font-size: 14px;
	color: rgba(153,153,153,1);
}

.report-name-group, .display-area, .time-group, .report-note-group {
	margin-bottom: 30px;
}

.redalert {
	color: red;
}
.whitedefault {
	/*must be the same with bg color*/
	color: #ffffff;
}
.btn-group {
	margin-left: 130px;
}

.unchecked-box, .checked-box {
	color: #5c9cec;
	cursor: pointer;
	font-size: 180%;
}

/*modify the style of current row*/
#show-all-tpls .el-table >>> .el-table__body tr.current-row>td {
	background: #f0f7ff !important;
	color: #5c9cec;
}

/*hide hover effect*/
#show-all-tpls .el-table--enable-row-hover >>> .el-table__body tr:not(.current-row):hover>td{
	background-color: transparent !important;
}

</style>