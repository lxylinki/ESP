<template>
	<div id='classmanage'>
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			班级管理
		</div>


		<div style="height: 20px;"></div>

		<div class="selectclass">

			<div class="searchwindow clsm-searchwindow">
				<el-input v-model="search_state" v-on:keydown.native="invokeSearch($event)" placeholder="请搜索班级名称"></el-input>
				<button class="searchbtn"  v-on:click="searchReq()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>
		</div>

		<div style="height: 20px;"></div>

		<div  style="display: inline-block;">
			<el-button class="addbtn" v-on:click="addClass()">添加</el-button>
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
		      prop="class_name"
		      label="班级名称"
		      min-width="200">
		    </el-table-column>
		    <el-table-column
		      prop="major"
		      label="专业"
		      min-width="200">
		    </el-table-column>

			<el-table-column label="教师"
	          min-width="200">

	          <template slot-scope="scope">
	          	<el-button class="op" type="text" @click="showTeachers(scope.row)">查看</el-button>
	          </template>
      		</el-table-column>
		    
		    <el-table-column
		      prop="status"
		      label="状态"
		      min-width="200">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.status == 1">启用</span>
		      	<span class="notinuse" v-if="scope.row.status == 0">失效</span>
		      </template>
		    </el-table-column>

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

<!---------------------------------------------------------------------------------->
		<ul class="teacherlist" v-show="show_teachers">
			<li class="teachertag" v-for="teacher in class_teachers">
				<el-tag>{{teacher.teacher_name}}</el-tag>
			</li>
		</ul>

		<ul class="editable_teacherlist" v-show="show_editable_teachers">
			<li class="teachertag" v-for="teacher in class_teachers">
				<el-tag  closable v-on:close="">{{teacher.teacher_name}}</el-tag>
			</li>
		</ul>

	</div>
</template>



<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import NewPager from '@/components/NewPager.vue';
	import global_ from '@/components/Global.js';
	import store from '@/vuex/store.js';

	export default {
		store: store,
		components: {
			//name is Pager here
			'NewPager': NewPager
		},

		data(){
			return {	
				mod_name: 'class-manage',

				//to store table data
				list:[],
				search_state: '',

				rowsPerPage:10,
				totalPage: 0,
				totalRows: 0,
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
				class_teachers: [],
				show_teachers: false,
				show_editable_teachers: false,
				loading: null
			}
		},

		methods: {
			invokeSearch(e){
		     	if(e.keyCode == 13) {
		     		//this.searchReq(this.curPage);
		     		this.reqClassData('', this.search_state, 1);
		     	}
		    },

			//teacher name, class name
			reqClassData(tkeyword, ckeyword, page){
		    	var class_api = global_.class_list
		     				  + '?page='
		     				  + page 
		     				  + '&pagesize='
		     				  + this.rowsPerPage;

		     	let req_data = {
		     		"search": {
		     			"teacher_name": tkeyword,
		     			"class_name": ckeyword
		     		}
		     	};

		     	this.$http.post(class_api, req_data).then((resp)=>{
		     		//console.log(resp);
		     		this.tableData = resp.body._list;
		     		this.totalPage = resp.body.total_page;
		     		this.filterData(page);
		     		layer.close(this.loading);

		     	},(err)=>{
		     		Utils.lalert('请求班级列表失败');
		     		console.log(err);
		     		layer.close(this.loading);
		     	});
			},

			showTeachers(row){
				//console.log(row);
				this.class_teachers = row.teachers;
				layer.open({
				  type: 1,
				  area: ['280px', '190px'],
				  title: row.class_name,
				  content: $('.teacherlist'),
				  /*
				  end: function(){
				  	$('.teacherlist').css('display','none');
				  }*/
				});
			},

			editRow(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				
				this.$router.push('/classedit');				
			},

			addClass(){
				this.$router.push('/classadd');
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			},

			loadPage(page){
				this.reqClassData('', this.search_state, page);
			},

			pageSizeChange(){
				//reload data
				this.reqClassData('', this.search_state, 1);
			},

			deleteRow(row) {
				var _this = this;
				Utils.lconfirm("确定删除班级？", function(){_this.delClass(row)});
			},

			delClass(row) {
				var api = global_.class_delete;
				let data = {
					'id': row.id
				}

				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除班级成功');
					this.loadPage(this.curPage);

				}, (err)=>{
					Utils.lalert('删除班级失败');
					console.log(err);
				});
			}

		},
		
		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			Utils.page_check_status.call(this);
			this.reqClassData('','', 1);
		},
	}
</script>

<style type="text/css" scoped>

.teacherlist, .editable_teacherlist {
	margin: 0;
	display: flex;
	flex-wrap: wrap;
	padding: 20px;
}
.teachertag {
	margin: 5px;
}
.pickclasstitle {
	display: inline-block;
	line-height: 60px;
}

.clsm-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0;
}

/* operations text buttons */
 .op{
  	position: relative;
  	bottom: 5px;
  	vertical-align: top;
  	line-height: 0;
 }  

 .notinuse {
 	color: #a1a1a1;
 }	


</style>