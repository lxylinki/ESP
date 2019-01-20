<template>
	<div id='studentmanage'>
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			学生管理
		</div>


		<div style="height: 20px;"></div>


		<div class="selectclass">
			<div style="display: inline-block; width: 20px;"></div>

			<div class="statustitle">状态：</div>
			
			<div style="display: inline-block;">

				  <el-select v-model="status_value" filterable placeholder="请选择" v-on:change="filterStatus()">
				    <el-option
				      v-for="item in status_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				    <!--
				    <SlimPager v-bind:current_page='curPage' 
   	           	  			   v-bind:pages='totalPage'
   		          			   @setPage='loadPage'
   		       		></SlimPager>-->
				  </el-select>

			</div>

			<div class="searchwindow stdm-searchwindow">
				<el-input class="student-searchinput" v-model="search_state" placeholder="请搜索用户名" v-on:keydown.native="invokeSearch($event)"></el-input>
				<button class="searchbtn" v-on:click="searchReq()"><i style="color: white;" class="el-icon-search"></i></button>
			</div>


		</div>

		<div style="height: 20px;"></div>

		<div  style="display: inline-block;">
			<el-button class="addbtn" v-on:click="addStudent()">添加</el-button>
		</div>

		
		<div style="display: inline-block; margin-left: 30px;">
	
			<div class='box'>
				<input type="file" id="uploadfile" v-on:change="upFile($event)">
				<label for='uploadfile' style="cursor: pointer;"></label>
				<el-button plain ><i class="iconfont">&#xe69c;</i>  批量导入</el-button>
			</div>
		</div>


		<div style="display: inline-block; margin-left: 10px;">
			<el-button plain  v-on:click="getTemplate(1)">
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

		<!--<div style="width: 80px;float: right;">显示 <el-select></el-select> 条</div>-->

		<div style="height: 15px;"></div>
		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">
		    <el-table-column
		      prop="realname"
		      label="真实姓名"
		      min-width="100">
		    </el-table-column>
		    <el-table-column
		      prop="username"
		      label="用户名"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="grade"
		      label="年级"
		      min-width="100">
		    </el-table-column>
		    
		    <el-table-column
		      prop="class_name"
		      label="班级"
		      min-width="100">
		    </el-table-column>

		    <!--
		    <el-table-column
		      label="创建时间"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span>{{transTime(scope.row.created_at)}}</span>
		      </template>
		    </el-table-column>	

		    <el-table-column
		      label="更新时间"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span>{{transTime(scope.row.updated_at)}}</span>
		      </template>
		    </el-table-column>-->

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="100">

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
	//import SlimPager from '../../SlimPager.vue';
	import NewPager from '../../NewPager.vue';
	import global_ from '../../Global.js';
	import Utils from '@/components/Utils.js';
	import store from '@/vuex/store.js';

	export default {
		components: {
			//name is Pager here
			//'SlimPager': SlimPager,
			'NewPager': NewPager
		},
		
		store: store,

		data(){
			return {	
				mod_name: 'student-manage',
				//to store table data
				list:[],
				dataChanged: false,

				dialogVisible: false,
				search_state: '',
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
				totalPage:0,
				curPage: 1,

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
				status_value: null,
				loading: null
			}
		},

		methods: {
			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.searchReq();
				}
			},

			searchReq(){
				this.reqData(this.search_state,'','',this.curPage);
			},

			filterStatus(){
				this.reqData(this.search_state, '', '', 1);
			},

			add0(m){
				return m<10?'0'+m:m 
			},

			transTime(ntime){
				return Utils.convTime.call(this, ntime);
			},

			reqData(username, realname, grade, page){
				var api = global_.student_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'status': this.status_value,
					'search':{
						'username': username,
						'realname': realname,
						'grade': grade
					}
				};

				this.$http.post(api, data).then((resp)=>{
					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					this.filterData(page);
					//console.log(resp.body._list);
					layer.close(this.loading);

				}, (err)=>{
					Utils.lalert('请求学生列表失败');
					console.log(err);
					layer.close(this.loading);
				});
			},

			addStudent(){
				this.$router.push('/studentadd');
			},

			editRow(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				
				this.$router.push('/studentedit');				
			},
			
			loadPage(page){
				this.reqData(this.search_state, '', '', page);
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;

			},

			pageSizeChange(){
				this.reqData(this.search_state,'','', 1);
			},

			deleteRow(row) {
				var _this = this;
				Utils.lconfirm("确定删除学生？", function(){_this.delStudent(row)});
			},
			delStudent(row) {
				var api = global_.student_delete;
				let data = {
					'user_id': row.user_id,
					'class_id': row.class_id
				}

				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除学生成功');
					this.loadPage(this.curPage);

				}, (err)=>{
					Utils.lalert('删除学生失败');
					console.log(err);
				});
				/*
				var realIdx = idx + this.rowsPerPage*(this.curPage-1); 
				this.tableData.splice(realIdx, 1);
				this.list = this.tableData.slice(this.rowsPerPage*(this.curPage-1), this.rowsPerPage*this.curPage);
				*/
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
		      	formData.append('group', global_.student_group);

		      	var api = global_.batch_upload;

		      	this.$http.post(api, formData).then((response)=>{
		      		console.log(response);
		      		
		      	}, (err)=>{
		      		console.log(err);
		      	});
		     }			

		},
		
		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			this.reqData('','','', 1);
			//layer.close(this.loading);
		}
	}
</script>

<style type="text/css" scoped>
/*
.selectclass {
	height: 80px;
	background: #cccccc;
}*/
.statustitle {
	display: inline-block; 
	line-height: 60px;
}
.stdm-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0px;
}

/* operations text buttons */
 .op{
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