<template>
	<div id="reportstats">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>报告统计</span>
		</div>
		<div class="selectclass">
			<!--
			<div class="pickclasstitle">班级：</div>		
			<div style="display: inline-block;">
				  <el-select filterable v-model="class_value" placeholder="请搜索班级名称" v-on:change="reqRecord()">
				    <el-option
				      v-for="item in class_options"
				      :key="item.id"
				      :label="item.class_name"
				      :value="item.id">
				    </el-option>
				  </el-select>		
			</div> -->
			<div class="searchwindow report-stats-searchwindow">
				<el-input class="report-stats-searchinput" v-model="search_state" v-on:keydown.native="" placeholder="请搜索班级名称"></el-input>
				<button class="searchbtn"  v-on:click="">
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
		      prop=""
		      label="班级名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    	    
		    <el-table-column
		      prop=""
		      label="参加人次"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="不及格人次"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="平均分"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="最高分"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="最低分"
		      min-width="100">
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
				class_value: '',
				class_options: [],
				search_state: '',
				list: [],
				tableData: [],
				exam_id: '',
			}
		},

		methods: {
			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},

			//for el-table
			formatter(row, column, cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1+ row.ridx);
			},
			//teacher name, class name
			/*
			reqClassData(tkeyword, ckeyword, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqClassList.call(this, tkeyword, ckeyword, page);
	     			this.class_options = resp.body._list;
	     			this.class_value = this.class_options[0].id;
	     			//console.log(this.class_value);					
				}
			},*/

			reqStatsList(){
				let api = global_.report_class_list;
				let data = {
					'exam_id': this.exam_id
				}
				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
					//This list is empty

				}, (err)=>{
					Utils.err_process.call(this, err, '请求报告统计列表失败');
				});
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
				this.reqStatsList();
			}
		}
	}
</script>

<style type="text/css">
.pickclasstitle {
	display: inline-block;
	line-height: 60px;
}

.report-stats-searchwindow {
    position: relative;
    top: -7px;
}
</style>