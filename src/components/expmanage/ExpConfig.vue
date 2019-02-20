<template>
	<div id="expconfig">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">授权管理</span>
			<el-button class="altgoback" type="text" v-on:click="goBack()">返回</el-button>
		</div>


		<div class="selectclass">
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="showAllTeachers()">添加</el-button>
			</div>
		</div>

		<div style="display: inline-block; float: right; margin: 10px;">
			<span>显示 </span>
				<select v-model="rowsPerPage" v-on:change="" style="width: 60px; height: 25px;">
					<option v-for="item in row_nums" v-bind:value="item.value">
						{{item.label}}
					</option>
				</select>
			<span> 条</span>
		</div>

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
		      label="状态"
		      min-width="100">
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
		      	<el-button class="op" type="text" @click="">
		      		取消授权
		      	</el-button>
		      </template>
		    
		    </el-table-column>
		  </el-table>
		</template>	

<!--------------------------------------------------------------------------------------------------------------------------------------------------------->

		<div id="show-all-teachers" v-show="false">
			
			<div class="selectclass">
				<div class="exp-name"><span>{{exp_name}}</span></div>
				<div class="searchwindow">
					<el-input class="searchinput" v-model="search_state" placeholder="请搜索真实姓名" v-on:keydown.native="invokeSearch($event)"></el-input>
					<button class="searchbtn" v-on:click="searchReq()"><i style="color: white;" class="el-icon-search"></i></button>
				</div>
			</div>

			<template>
			  <el-table
			    :data="tlist"
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

			    <el-table-column
			      prop="operation"
			      label="操作"
			      min-width="200">
			      <template slot-scope="scope">
			      	<el-button v-show="!focus_tids.includes(scope.row.user_id)" class="op selectbtn" type="text" @click="selectRow(scope.row)">
			      		+添加
			      	</el-button>
			      	<el-button v-show="focus_tids.includes(scope.row.user_id)" class="op removebtn" type="text" @click="removeRow(scope.row)">
			      		-移除
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
		</div><!--end show all teachers-->

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
			return {
				list: [],
				tlist: [],
				totalPage: 0,
				curPage: 1,
				//fixed
				rowsPerPage: 5,
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
				exp_name: '',
				focus_tids: [],
				search_state: '',
				exp_id: null
			}
		},

		methods: {
			goBack(){
				this.$router.go(-1);
			},

			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.reqData(this.search_state, 1);
				}
			},

			showAllTeachers(){
				layer.open({
					type: 1,
					area: [],
					title: '',
					content: $('#show-all-teachers')
				});		    	
		    },

		    //req teacher list in panel
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
				  		'username': '',
				  		'realname': keyword
				  	}
				}

				this.$http.post(list_api, req_data).then((resp)=>{
					//console.log(resp);
					this.totalPage = resp.body.total_page;
					this.tlist = resp.body._list;
					this.curPage = page;

				},(err)=>{
					Utils.err_process.call(this, err, '请求教师列表失败'); 
				});
			},

			loadPage(page) {
				this.reqData(this.search_state, page);
			},

			selectRow(trow){
				//console.log(row);
				this.focus_tids.push(trow.user_id);
				let api = global_.exp_teacher_add;
				let data = {
					"eid": this.exp_id,
					"user_ids":[trow.user_id]
				}
				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
					this.list = this.exp.teachers;
				}, (err)=>{
					console.log(err);
				});
			},

			removeRow(trow){

			}
		},

		mounted(){
			var edit = this.$store.state.edit;
			if(!edit) {
				this.$router.go(-1);

			} else {
				//var row = storage.get('row');
				var row = this.$store.state.row;
				//console.log(row);
				this.exp = row;
				this.exp_name = row.name;	
				this.list = row.teachers;
				this.exp_id = row.eid;
				this.reqData(null, 1);	
			}

		}
	}
</script>

<style type="text/css" scoped>
.exp-name {
	display: inline-block;
	margin: 20px;
}
.addbtndiv {
	display: inline-block;
	margin-top: 15px;
}
.altgoback {
	margin-left: 20px;
}

#show-all-teachers {
	padding: 20px;
	overflow: hidden;
}
</style>