<template>
	<div id="reportstats">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>报告统计</span>
			<el-button class="altgoback" type="text" v-on:click="goBack()">返回</el-button>
		</div>
		<div style="height: 20px;"></div>
		<div class="selectclass">
			
			<div class="pick-class-title">班级：</div>	
			<div class="class-picker">
				<SearchSelect v-bind:items="class_options"
							  @makechoice="filterByClass"></SearchSelect>
			</div>
			<!--
			<div class="searchwindow report-stats-searchwindow">
				<el-input class="report-stats-searchinput" v-model="search_state" v-on:keydown.native="" placeholder="请搜索班级名称"></el-input>
				<button class="searchbtn"  v-on:click="">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div> -->
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
		      prop="class_name"
		      label="班级名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    	    
		    <el-table-column
		      prop="user_count"
		      label="参加人次"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="fail_count"
		      label="不及格人次"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="avg_score"
		      label="平均分"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="max_score"
		      label="最高分"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="min_score"
		      label="最低分"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="create_time"
		      label="生成时间"
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
	import SearchSelect from '@/components/SearchSelect.vue';
	import NewPager from '@/components/NewPager.vue';

	export default {
		components: {
			'NewPager': NewPager,
			'SearchSelect': SearchSelect
		},
		data(){
			return {
				class_value: '',
				class_options: [],
				search_state: '',
				list: [],
				tableData: [],
				exam_id: '',
				curPage: 1,
				rowsPerPage: 10,
				totalPage: 0,
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
			goBack(){
				this.$router.go(-1);
			},
			
			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},
			//for el-table
			formatter(row, column, cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1+ row.ridx);
			},
			//teacher name, class name
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

			reqStatsList(exam_id, class_id, page){
				let api = global_.report_class_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'exam_id': exam_id,
					'class_id': class_id
				}

				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					for(let item of this.tableData) {
						item.create_time = Utils.convTime(item.created_at);
						if(Object.keys(resp.body.classes).includes(item.class_id)) {
							item.class_name = resp.body.classes[item.class_id].name;
						}
					}
					this.filterData(page);

				}, (err)=>{
					Utils.err_process.call(this, err, '请求报告统计列表失败');
				});
			},

			loadPage(page) {
				this.reqStatsList(this.exam_id, this.class_value, page);
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			},

			filterByClass(class_id) {
				this.class_value = class_id;
				this.loadPage(1);
			},

			pageSizeChange(){
				this.loadPage(1);
			}
		},

		mounted(){
			Utils.page_check_status.call(this);
			let edit = this.$store.state.edit;
			//this.reqClassData('', '', 1);
			if(!edit) {
				this.$router.go(-1);

			} else {
				let row = this.$store.state.row;
				this.exam_id = row.id;
				this.reqClassData(null, null, 1);
				this.reqStatsList(this.exam_id, this.class_value, 1);
			}
		}
	}
</script>

<style type="text/css">
.pick-class-title {
	display: inline-block;
	line-height: 55px;
	vertical-align: middle;
}

.class-picker {
	display: inline-block;
}

.report-stats-searchwindow {
    position: relative;
    top: -7px;
}
.altgoback {
	margin-left: 20px;
}
</style>