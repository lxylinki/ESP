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

		<div class="exp-catag-group">
			<div class="exp-catag-label">实验分类</div>
			<el-select class="longselect report-exp-catag" v-model="catag_value" placeholder="请搜索实验分类名称" filterable>
				<el-option
				  v-for="item in catag_options"
				  :key="item.id"
				  :label="item.name"
				  :value="item.id"
				  :class="{leafcatag: item.isleaf, midcatag: item.ismid, unselectable: !item.isleaf}">
				</el-option>
			</el-select>
			<span class="redalert" v-show="!catag_value">*</span>
			<span class="whitedefault" v-show="catag_value">*</span>
		</div>

		<div class="tpl-select-group">
			<div class="tpl-select-label">选择模板</div>
			<el-button class="tpl-select-link" type="text" v-on:click="showTplList()">
				<span v-show="!tpl_selected">选择模板</span><span v-show="tpl_selected">重新引用</span>
			</el-button>
		</div>

		<div class="display-area" v-show="tpl_selected">
			<span>名称：{{tpl_name}}</span><br><span>分数：{{tpl_score}}分</span>
		</div>

		<!--
		<div class="time-group">
			<div class="time-label">开始时间</div>
			<input class="start-time" type="datetime-local" v-model="start_time"><span class="until">至</span>
			<input class="end-time" type="datetime-local" v-model="end_time">
			<div class="time-interval" v-show="start_time && end_time">{{interval(start_time, end_time)}}</div>
		</div> --> 

		<div class="time-group">
			<div class="time-label">开始时间</div>
			<el-date-picker v-bind:class="{invalid: valid_start(start_time) && start_time}" 
							v-model="start_time" 
							type="datetime" 
							:picker-options="pickerOptsStart" 
							placeholder="选择日期时间">			
			</el-date-picker>

			<span class="until">至</span>

			<el-date-picker v-bind:class="{invalid: valid(start_time, end_time) && end_time}" 
							v-model="end_time" type="datetime" 
							:picker-options="pickerOptsEnd" 
							placeholder="选择日期时间">	
			</el-date-picker>

			<div class="time-interval" v-show="start_time && end_time" v-bind:class="{warntext: valid(start_time, end_time)}">{{interval(start_time, end_time)}}</div>
			<div class="instruction" v-show="!start_time || !end_time"><span>开始时间不应小于当前，时间间隔至少为30分钟</span></div>
		</div>

		<div class="report-note-group">
			<div class="report-note-label">实验说明</div>
			<textarea class="report-note" v-model="report_note"></textarea>
		</div>

		<div class="btn-group">
			<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
		</div>

<!--------------------------------------------------------------------------------------------------------------------------->
		<div id="show-all-tpls" v-show="false">

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
			      min-width="120">
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
			      min-width="80">
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
				<el-button class="confirm" v-on:click="choose()">确定</el-button>
				<el-button class="goback" v-on:click="cancel()">取消</el-button>
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
				catag_options: [],
				totalPage: 0,
				curPage: 1,
				rowsPerPage: 10,
				search_state:'',
				tpl_choice: null,
				layeridx: null,

				report_name: '',
				tpl_selected: false,
				tpl_score: 0,
				tpl_name: 'test',
				start_time: null,
				end_time: null,
				report_note: '',
				catag_value: '',

				pickerOptsStart: {
					disabledDate:(time)=>{
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				pickerOptsEnd: {
				    disabledDate:(time) => {
				        return time.getTime() < this.start_time - 8.64e7 || time.getTime() < Date.now() - 8.64e7;
				    }
				},

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
					time = Math.floor(seconds/(3600*24)) + "天" + Math.floor(hours/3600) + "时" + Math.floor(mins/60) + "分"+ seconds%60 + "秒";
					//time = Math.floor(seconds/(3600*24)) + "天" + Math.floor(hours/3600) + "时" + Math.floor(mins/60) + "分";
				return time;
			},

			interval(start, end) {
				if(end >= start) {
					return this.toDayHourMin(this.toSeconds(end) - this.toSeconds(start));
				} else {
					return '-' + this.toDayHourMin(this.toSeconds(start) - this.toSeconds(end));
				}
				
			},

			valid_start(start) {
				return start<=Date.now();
			},

			valid(start, end) {
				return end<=start || (end-start)/1000 < 1800 || start<=Date.now();
			},

			goBack(){
				this.$router.go(-1);
			},

			showTplList(){
				this.reqTplList(null, 1);
				this.layeridx = layer.open({
					type: 1,
					area: ['700px', '765px'],
					title: '',
					content: $('#show-all-tpls'),
					cancel: this.cancel
				});	
			},

			preCheck(){
				if(!this.report_name) {
					Utils.lalert('请输入实验报告名称');
					return;

				} else if(!this.tpl_choice) {
					Utils.lalert('请选择模板');
					return;

				} else if(!this.start_time || !this.end_time){
					Utils.lalert('请输入起止时间');
					return;

				} else {
					this.addCreate();
				}
			},

			addCreate(){
				let api = global_.report_create;
				let data = {
					'paper_id': this.tpl_choice,
					'name': this.report_name,
					'started_at': this.toSeconds(this.start_time),
					'ended_at': this.toSeconds(this.end_time),
					'cid': this.catag_value
				}
				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
					Utils.lalert('实验报告创建成功');
					this.$router.go(-1);

				}, (err)=>{
					Utils.err_process.call(this, err, '创建实验报告失败');
				});
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
				this.tpl_name = row.name;
				this.tpl_score = row.score;
			},

			row_selected(row) {
				return this.tpl_choice == row.id;
			},

			choose(){
				this.tpl_selected = true;
				layer.close(this.layeridx);
			},

			cancel(){
				this.tpl_selected = false;
				this.tpl_choice = null;
				layer.close(this.layeridx);
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
					//console.log(this.catag_options);				
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
		},

		mounted(){
			Utils.page_check_status.call(this);
			this.reqCatagList();
			//this.reqTplList(null, 1);
		}
	}
</script>

<style type="text/css" scoped>
.longselect /deep/ .el-input__inner {
	box-sizing: border-box;
	width:500px;
	height:36px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,0.5);
	border-radius:4px;
}
.leafcatag {
	padding-left: 35px;
	color: #757575;
}

.midcatag {
	padding-left: 25px;
	color: #757575;
}

.unselectable {
	color: #d7d7d7;
	pointer-events: none;
}

#show-all-tpls .selectclass {
	background: white;
	height: 100px;
}

#show-all-tpls {
	padding: 20px;
	overflow: auto;
}

.report-name {
	box-sizing: border-box;
	width:500px;
	height:36px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,0.5);
	border-radius:4px;
}

/*
.start-time, .end-time {
	width:180px;
	height:36px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,0.5);
	border-radius:4px;
	padding-left: 15px;
}*/

.el-date-editor.invalid >>> .el-input__inner{
	color: red;
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
.report-note-label, .exp-catag-label {
	display: inline-block;
}

.report-note-label {
	vertical-align: top;
}

.report-name-label, .tpl-select-label, .time-label, .report-note-label, .exp-catag-label {
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

.instruction {
	color: rgba(153,153,153,1);
	font-size: 12px;
	margin-left: 130px;
	margin-top: 10px;
}

.report-name-group, .display-area, .time-group, .report-note-group, 
.exp-catag-group {
	margin-bottom: 30px;
}

.redalert, .warntext {
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

.tpl-btn-group {
	position: absolute;
	bottom: 30px;
	right: 30px;
}
.time-group {
	margin-top: 30px;
}
</style>