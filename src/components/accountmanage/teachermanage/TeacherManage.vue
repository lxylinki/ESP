<template>
	<div id='teachermanage'>
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			教师管理
		</div>


		<div style="height: 20px;"></div>


		<div class="selectclass">
			<!--<div style="display: inline-block; width: 20px;"></div>-->

			<div class="statustitle">状态：</div>
			
			<div style="display: inline-block;">

				  <el-select v-model="status_value" filterable placeholder="请选择" v-on:change="filterStatus()">
				    <el-option
				      v-for="item in status_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>

			</div>
			
			<div class="searchwindow tm-searchwindow">
				<el-input class="tm-searchinput" v-model="search_state" placeholder="请搜索用户名" v-on:keydown.native="invokeSearch($event)"></el-input>
				<button class="searchbtn" v-on:click="searchReq()"><i style="color: white;" class="el-icon-search"></i></button>
			</div>

		</div>

		<div style="height: 20px;"></div>

		<div  style="display: inline-block;">
			<el-button class="addbtn" v-on:click="addTeacher()">添加</el-button>
		</div>

		
		<div style="display: inline-block; margin-left: 30px;">
			<div class='box'>
				<input type="file" id="uploadfile" v-on:change="upFile($event)">
				<label for='uploadfile' style="cursor: pointer;"></label>
				<el-button plain ><i class="iconfont">&#xe69c;</i>  批量导入</el-button>
			</div>
		</div>


		<div style="display: inline-block; margin-left: 10px;">
				<!--0,1-->
				<el-button v-on:click="getTemplate(0)">
					<i class="iconfont">&#xe7a3;</i> 下载模板
				</el-button>
		</div>
		

		<!--choose rows per page-->
		<div style="display: inline-block; float: right; margin: 0px;">
			<span>显示 </span>
				<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 28px;">
					<option v-for="item in row_nums" v-bind:value="item.value">
						{{item.label}}
					</option>
				</select>
			<span> 条</span>
		</div>

		<div style="height: 15px;"></div>

		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">
		    <el-table-column
		      prop="realname"
		      label="真实姓名"
		      min-width="200">
		    </el-table-column>
		    <el-table-column
		      prop="username"
		      label="用户名"
		      min-width="200">
		    </el-table-column>
		    
		    <!--
		    <el-table-column
		      prop="class"
		      label="班级"
		      min-width="200">
		    </el-table-column>
		-->

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="200">

		      <template slot-scope="scope">

		      	<el-button class="op" type="text" @click="editRow(scope.row)">
		      		<i class="iconfont">&#xe61a;</i>编辑
		      	</el-button>
		      	
		      	<!--<el-button type="text" @click="tableData.splice(scope.$index, 1)">-->
		      	<el-button class="op" type="text" @click="deleteRow(scope.row)">
		      		<i class="iconfont">&#xe7e0;</i>删除
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
	import global_ from '@/components/Global.js';
	import NewPager from '@/components/NewPager.vue';
	import store from '@/vuex/store.js';
	import Utils from '@/components/Utils.js';

	export default {
		components: {
			//name is Pager here
			'NewPager': NewPager
		},
		store: store,
		data(){
			return {
				mod_name: 'teacher-manage',
				//edit password
				password:'',
				ufile: '',
				//to store table data
				list:[],
				dataChanged: false,
				dialogVisible: false,
				value: '',
				search_state: null,
				status_options: [
					{
						label: '全部',
						value: null
					},
					{
						label: '启用',
						value: 1
					},
					{
						label: '失效',
						value: 0
					}
				],

				rowsPerPage:10,
				totalRows: 0,
				totalPage: 0,
				curPage: 1,
				status_value: null,

				//10-50
				row_nums: [
					{
						label: '5',
						value:5
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
						label:'25',
						value: 25
					}

				],
				tableData: [],
				loading: null
			}
		},

		methods: {
			invokeSearch(e){
		     	if(e.keyCode == 13) {
		     		this.searchReq();
		     	}
		    },

			addTeacher(){
				this.$router.push('/teacheradd');
			},
			
			editRow(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$router.push('/teacheredit');
			},

			filterData(page) {
				//this.list = this.tableData.slice(this.rowsPerPage*(page-1), this.rowsPerPage*page);
				this.list = this.tableData;
				this.curPage = page;
			},

			pageSizeChange(){
				//reload data
				this.reqData(this.search_state, 1);
			},

			deleteRow(row) {
				var _this = this;
				Utils.lconfirm("确定删除教师？", function(){_this.delTeacher(row)});
			},

			delTeacher(row) {
				var api = global_.teacher_delete;
				let data = {
					'user_id': row.user_id
				}

				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除教师成功');
					this.reqData(this.search_state, this.curPage);

				}, (err)=>{
					Utils.lalert('删除教师失败');
					console.log(err);
				});
			},

			getTemplate(tpl){
				//var api = '/mengoo/index.php/site/get-tpl';
				var api = global_.get_template;
				var toUrl = api+'?tpl='+tpl;
				//window.open(toUrl, '_self');
				window.open(toUrl);
				//window.location.href = toUrl;
			},

		     upFile(event) {
		      	this.ufile = event.target.files[0];

		      	var formData = new FormData();
		      	formData.append('batch-signup', this.ufile);
		      	formData.append('group', global_.teacher_group);

		      	//upload request
		      	var api = global_.batch_upload;
		      	this.$http.post(api, formData).then((response)=>{
		      		Utils.lalert('批量导入成功');
		      		
		      	}, (err)=>{
		      		Utils.lalert('批量导入失败');
		      		console.log(err);
		      	});

		     },

		     reqData(keyword, page){
			    //list request
			    var list_api = global_.teacher_list
							 + '?page=' 
							 + page 
							 + '&pagesize=' 
							 + this.rowsPerPage;

			    let req_data = {
			    	'status': this.status_value,
			      	'search': {
			      		'username': keyword,
			      		'realname': ''
			      	}
			    }

			    this.$http.post(list_api, req_data).then((resp)=>{
			    	console.log(resp);
			    	this.$store.commit('sign', this.mod_name);
			    	this.$store.commit('setRowNumBefore', resp.body.total);
			    	this.$store.commit('setRowNumAfter', resp.body.total);
			    	this.$store.commit('setRowsPerPage', this.rowsPerPage);
					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
			    	this.filterData(page);
			    	layer.close(this.loading);

			    },(err)=>{
			    	Utils.lalert('请求列表失败');
			    	console.log(err);
			    	layer.close(this.loading);
			    });
		     },

		     loadPage(page){
		     	this.reqData(this.search_state, page);
		     },

		     searchReq(){
		     	this.reqData(this.search_state, 1);
		     },

		     filterStatus(){
		     	this.reqData('', 1);
		     }
		},
		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},
		mounted(){
			var name = this.$store.state.last_author;

			if(name === this.mod_name) {
				var before = this.$store.state.row_num_before,
					after = this.$store.state.row_num_after,
					pagesize = this.$store.state.rows_per_page,
					keyword = this.$store.state.current_search,
					curpage = this.$store.state.current_page;

				if (pagesize > 0) {
					this.rowsPerPage = pagesize;
				}

				if (keyword) {
					this.search_state = keyword;
				}

				//item added: default append to list end
				if(after > before) {
					this.curPage = Math.ceil(after / this.rowsPerPage);	

				} else if(curpage > 0) {
					this.curPage = curpage;
				} 				
			}
			this.reqData(this.search_state, this.curPage);
			//layer.close(this.loading);
		}
	}
</script>

<style type="text/css" scoped>

.formlabel {
	display: inline-block;
}

.forminput {
	width: 300px;
	display: inline-block;
}

.statustitle {
	display: inline-block; 
	line-height: 60px;
}

.tm-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0px;
}
/*
.selectclass {
	height: 80px;
	background: #cccccc;
}*/

/* operations text buttons */
 .op {
  	position: relative;
  	bottom: 8px;
  	vertical-align: top;
  	line-height: 0;
  }  

  .box{
  	position: relative;
  }

  #uploadfile {
  	position: absolute;
  	left: -9999px;
  	opacity: 0;
  }

  label {
  	position: absolute;
  	top: 0px;
  	left: 0px;
  	bottom: 0px;
  	right: 0px;
  }
</style>