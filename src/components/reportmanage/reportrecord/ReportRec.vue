<template>
	<div id="reportrecord">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>报告记录</span>
		</div>

		<div class="selectclass">
			<div class="pickclasstitle">班级：</div>	
			<div class="pick-class"  style="display: inline-block;">
				<SearchSelect v-bind:items="class_options"
							  @makechoice="filterByClass"></SearchSelect>
			</div>

			<div class="searchwindow report-rec-searchwindow">
				<el-input class="searchinput report-rec-searchinput" 
						  v-model="search_state"
						  v-on:keydown.native=""
						  placeholder="请搜索报告名称">		  
				</el-input>
				<button class="searchbtn report-searchbtn" v-on:click="filterReport()">
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
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="grade_time"
		      label="批改时间"
		      min-width="100">
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
		      	<el-button class="op" type="text" @click="">
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
				list: [],
				tableData: [],
				rowsPerPage: 10,
				class_value: '',
				report_value: '',
				marked_value: '',
				search_state: '',
				curPage: 1,
				totalPage: 0,
				class_options: []

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
	     			//console.log(this.class_value);					
				}
			},

			reqRecList(class_id, exam_id, has_marked, page){
				let api = global_.report_rec_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'match': {
						'class_id': class_id,
						'exam_id': exam_id,
						'has_marked': has_marked
					}
				}

				this.$http.post(api, data).then((resp)=>{
					this.totalPage = resp.body.total_page;
					this.tableData = resp.body._list;
					for(let item of this.tableData) {
						item.exam_name = resp.body.exams[item.exam_id].name;
						item.student_name = resp.body.users[item.user_id].realname;
						item.class_name = resp.body.classes[item.class_id].name;
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
				this.reqRecList(this.class_value, this.report_value, this.marked_value, page);
			},

			filterByClass(class_id) {
				this.class_value = class_id;
				this.loadPage(1);
			}		
		},

		mounted(){
			this.reqClassData(null, null, 1);
			this.reqRecList(null, null, null, 1);
		}
	}
</script>

<style type="text/css" scoped>
.pickclasstitle {
	display: inline-block;
	line-height: 60px;
}
.report-rec-searchwindow {
    position: relative;
    top: -7px;
}
</style>