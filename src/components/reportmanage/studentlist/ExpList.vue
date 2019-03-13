<template>
	<div id="student-explist">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>实验报告列表</span>
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

			<div class="searchwindow student-report-searchwindow">
				<el-input class="searchinput student-report-searchinput" 
						  v-model="search_state"
						  v-on:keydown.native="invokeSearch($event)"
						  placeholder="请搜索实验名称">		  
				</el-input>
				<button class="searchbtn report-searchbtn" v-on:click="filterReport()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>			
		</div>

		<div style="display: inline-block; float: right; margin: 10px;">
			<span>显示 </span>
				<select v-model="rowsPerPage" v-on:change="filterReport()" style="width: 60px; height: 25px;">
					<option v-for="item in row_nums" v-bind:value="item.value">
						{{item.label}}
					</option>
				</select>
			<span> 条</span>
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
		      prop="name"
		      label="实验名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    	    
		    <el-table-column
		      prop="start_time"
		      label="开始 / 截止时间"
		      min-width="180">
		      <template slot-scope="scope">
		      	{{scope.row.start_time}}{{sep_sign}}
		      	{{scope.row.end_time}}
		      </template>
		    </el-table-column>

		    <!--
		    <el-table-column
		      prop="creator"
		      label="创建人"
		      min-width="100">
		    </el-table-column>-->

		    <el-table-column
		      prop=""
		      label="状态"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.status == 1">进行中</span>
		      	<span v-else-if="scope.row.status == 2" >已关闭</span>
		      	<span class="unknown-label" v-else>未知</span>
		      </template>
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="状态"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.joined">已参加</span>
		      	<span v-if="!scope.row.joined" >未参加</span>
		      </template>
		    </el-table-column>

		    <el-table-column
		      label="操作"
		      min-width="200">

		      <template slot-scope="scope">	      	
		      	<el-button class="op" v-bind:disabled="scope.row.status != 1" type="text" @click="showDownload(scope.row)">
		      		下载模板
		      	</el-button>
		      	<el-button class="op" v-bind:disabled="scope.row.status != 1" type="text" @click="showUpload(scope.row)">
		      		提交报告
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
<!------------------------------------------------------------------------------------------------------------------------------------------------->
		<div id="show-download-panel" v-show="false">
			<div class="display-area">
				<img class="thumbnail" src=""><br>
				<label for="thumbnail" class="img-label">{{file_name}}</label><br>
				<el-button class="addbtn" v-on:click="downloadFile()">下载文件</el-button>
			</div>			
		</div>

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
				study_stage: 0,
				sep_sign: ' / ',
				list: [],
				tableData: [],
				status_value: null,
				status_options: [],
				curPage: 1,
				totalPage: 0,
				rowsPerPage: 10,
				search_state: '',
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
				status_options: [
					{
						label: '全部状态',
						value: null
					},
					{
						label: '已关闭',
						value: 2
					},
					{
						label: '进行中',
						value: 1
					}
				],
				layer_idx: null,
				file_name: null,
				file_src: null
			}
		},

		methods: {
			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.filterReport();
				}
			},

			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},
			//for el-table
			formatter(row, column ,cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1+ row.ridx);
			},

			reqMyList(status, name, page){
				let api = global_.report_mylist
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'match': {
						'status': status
					},
					'search': {
						'name': name
					}
				}

				this.$http.post(api, data).then((resp)=>{
					//console.log(resp);
					this.tableData = resp.body._list;
					
					for(let item of this.tableData) {
						item.start_time = Utils.convTime(item.started_at);
						item.end_time = Utils.convTime(item.ended_at);
						item.joined = Object.keys(resp.body.joined_exams).includes(item.id);							
					}
					
					this.totalPage = resp.body.total_page;
					this.filterData(page);
					//console.log(resp);

				}, (err)=>{
					Utils.err_process.call(this, err, '请求实验报告列表失败');
				});
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			},

			filterReport(){
				this.loadPage(1);
			},

			loadPage(page) {
				this.reqMyList(this.status_value, this.search_state, page);
			},

			//upload only when not joined yet
			joinStudy(row){
				asyncReq.call(this);
				async function asyncReq(){
					let profile = await Utils.page_check_status.call(this),
						api = global_.report_join;
						data = {
						'exam_id': row.id,
						'class_id': profile.body.class_id
					}
					this.$http.post(api, data).then((resp)=>{
						//record_id
						console.log(resp.body.id);
					}, (err)=>{
						Utils.err_process.call(this, err, '学习实验报告失败');
					});
				}
			},

			reqQuesInfo(exam_id) {
				return new Promise((resolve, reject)=>{
					let api = global_.report_rec_ques,
						data = {
							'id': exam_id,
							'mode': 2
					};
					this.$http.post(api, data).then((resp)=>{
						//let type = resp.body._list.main[0].type,
						//	qid = resp.body._list.main[0].question_id;
						//console.log(type, qid, resp.body._list.questions[type][qid].fid);
						//resolve(resp.body._list.questions[type][qid].fid);
						resolve(resp);
					}, (err)=>{
						Utils.err_process.call(this, err, '请求问题信息失败')
					});
				});
			},

			fileIsExcel(){
				return this.file_type === 'sheet';
			},

			fileIsWord(){
				return this.file_type === 'document';
			},

			showDownload(row) {
				this.layer_idx = layer.open({
					type: 1,
					area: ['700px', '400px'],
					title: '',
					content: $('#show-download-panel')
				});	

				asyncReq.call(this);
				async function asyncReq(){
					let resp = await this.reqQuesInfo(row.id),
						type = resp.body._list.main[0].type,
						qid = resp.body._list.main[0].question_id,
						fid = resp.body._list.questions[type][qid].fid;
						
					this.file_src = global_.report_rec_load + '/' + fid;
					
					this.file_name = fid;

					this.$http.get(this.file_src).then((resp)=>{
						let content_type = resp.headers.map['content-type'][0].split(/[^a-z]+/g);
						this.file_type = content_type.pop();

						if(this.fileIsExcel()) {
							$('.thumbnail').attr('src', require('@/assets/excel.svg'));

						} else if(this.fileIsWord()) {
							$('.thumbnail').attr('src', require('@/assets/word.svg'));
						}

					}, (err)=>{
						Utils.err_process.call(this, err, '获取文件信息失败');
					});
				}
			},

			downloadFile(){
				window.open(this.file_src);
			},

			showUpload(row) {
			},
		},

		mounted(){
			Utils.page_check_status.call(this).then();
			this.reqMyList(null, null, 1);
		}
	}
</script>

<style type="text/css" scoped>
.pick-status-title {
	display: inline-block; 
	line-height: 60px;
}		

.student-report-searchwindow {
    position: relative;
    top: -7px;
}

.unknown-label {
	color: #d7d7d7;
}

.display-area {
	text-align: center;
}

.thumbnail {
	position: relative;
	top: 100px;
}

.img-label {
	position: relative;
	top: 100px;
}

.addbtn {
	position: relative;
	top: 120px;
}
</style>