<template>
	<div id="teacherview">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			成绩统计
		</div>
		<div style="height: 20px;"></div>

		<div class="selectclass">
			<div style="display: inline-block; width: 20px;"></div>

			<div class="pickexptitle">实验： </div>
			
			<div style="display: inline-block;">
				  <el-select filterable v-model="exp_value" placeholder="请搜索实验名称" v-on:change="reqRecord()">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.eid">
				    </el-option>
				  </el-select>				
			</div>

			<div style="display: inline-block; width: 20px;"></div>

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
			</div>

			<div class="searchwindow teacher-searchwindow">
				<el-input class="teacher-searchinput" v-model="search_keyword" v-on:keydown.native="invokeSearch($event)" placeholder="请搜索实验名称"></el-input>
				<button class="searchbtn"  v-on:click="reqRecord()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>

		</div><!--selectclass-->


		<div style="display: flex; align-items: flex-start;">

		<div class="leftpanel">
			<template>
			    <el-table
			      class="score_table"
			      ref="scoretable"
			      height="350px"
			      :highlight-current-row="true"
			      :data="scorelist"
			      @row-click="invokeShowRight"
			      :row-class-name="row_name">

					<el-table-column
					  label="序号"
					  :formatter="formatter"
					  min-width="50">
					</el-table-column>			      

			      <el-table-column
			        prop="realname"
			        label="学生名称"
			        min-width="120">
			      </el-table-column>
			      
			      <el-table-column
			        prop="class_name"
			        label="班级名称"
			        min-width="120">
			      </el-table-column>
			      
			      <el-table-column
			        prop="name"
			        label="实验名称"
			        min-width="120">
			      </el-table-column>
			    
	      		  <el-table-column
			        prop="exam_score"
			        label="成绩"
			        min-width="100">
			      </el-table-column>

			      <el-table-column
			        prop=""
			        label="查看"
			        min-width="100">

			       	<template slot-scope="scope">
			       	<!--	
			      	<el-button  class="op" type="text" @click="delRecord(scope.row)">
			      		<i class="iconfont">&#xe603; </i>清除记录
			      	</el-button> -->
			      	<!--<el-button type="text" @click="tableData.splice(scope.$index, 1)">-->
			      	<!--<el-button class="op" type="text" @click="delRow(scope.$index)">-->
			      	<el-button class="op" type="text">
			      		详情 <!--<i class="iconfont" style="color: #0099ff;"> &#xe629;</i>-->
			      	</el-button>

			      </template>
			      </el-table-column>

			    </el-table>
			</template>


			<div class="tablefooter">
				<!--
				<div class="rownum">
					<span>显示 </span>
						<select v-model="rowsPerPage" v-on:change="reqRecord()" style="width: 60px; height: 25px;">
							<option v-for="item in row_nums" v-bind:value="item.value">
								{{item.label}}
							</option>
						</select>
					<span> 条</span>
				</div>-->

				<!--
				<div class="pages">
		   		<NewPager v-bind:current_page='curPage' 
		   	           	  v-bind:pages='totalPage'
		   		          @setPage='loadPage'
		   		></NewPager>		
				</div>-->						
			</div>
	

		</div>

		<!--seperate line-->
		<!--<div v-show="right_panel" style="float:left; width: 1px; height: 1000px; background: #d7d7d7; margin-left: 40px;"></div> -->
		
		<div class="rightpanel">
			<!--<div style="height: 20px;"></div>-->
			<Records v-if="right_panel"
					 ref="recordPanel" 
					 v-bind:class_id = 'row_class_value'
					 v-bind:expr_id = 'row_exp_value'
					 v-bind:user_id = 'user_value'
			         v-bind:records='records'
			         v-bind:isTeacher = 'isTeacher'
			         v-on:rmRecord='reqRecord'
			         style="margin-left: 42px;"></Records>
		</div>

		<div style="clear: both;"></div>
		</div>

	</div>
</template>

<script type="text/javascript">
	import NewPager from '../NewPager.vue';
	import global_ from '../Global.js';
	import Records from './Records.vue';
	import Utils from '../Utils.js';

	export default {
		data(){
			return {
				mod_name: 'score-stats',
				//exper_id, class_id
				exp_value: '',
				class_value: '',
				row_exp_value: '',
				row_class_value: '',
				user_value: '',
				exp_options: [],
				class_options: [],
				scorelist: [],
				search_keyword:'',
				right_panel: false,
				records:[],
				exam_records:[],
				index: 0,
				isTeacher:true,


				curPage: 1,
				totalPage: 0,
				rowsPerPage: 10,
				row_nums:[
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
						label:'25',
						value: 25
					}				
				],
				total_exp: 0,
				total_class: 0,
				loading: null
			}
		},
		components: {
			'Records': Records,
			'NewPager': NewPager
		},
		
		methods: {
			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},
			
			formatter(row, column ,cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1+ row.ridx);
			},

			invokeShowRight(row){
				this.showRight(row, row.ridx);
			},

			invokeSearch(e){
				if(e.keyCode == 13) {
					this.searchReq();
				}
			},

			reqExpData(keyword, ugroup) {
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this, keyword, ugroup);
			    	this.exp_options = resp.body._list;
			    	this.exp_options.unshift({'name': '所有实验', 'eid': null});
			    	this.exp_value = this.exp_options[0].eid;
			    	this.reqRecord();
				}
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

		     reqRecordData(eid, cid, keyword, page){
		     	var record_api = global_.record_list
		     				   + '?page='
		     				   + page
		     				   + '&pagesize='
		     				   + this.rowsPerPage;

		     	let req_data = {
		     		"eid": eid,
		     		"class_id": cid,
		     		"search": {
		     			"name": keyword
		     		}
		     	};

		     	this.$http.post(record_api, req_data).then((resp)=>{
		     		if(resp.body) {
		     			this.scorelist = resp.body._list;
		     			if(this.scorelist.length === 0) {
		     				if(this.loading) {
		     					layer.close(this.loading);
		     				}
		     			}
		     		}
		     		if (this.scorelist.length == 0) {
		     			this.right_panel = false;

		     		} else {
		     			this.showRight(this.scorelist[0], this.scorelist[0].ridx);
		     		}
		     		
		     		this.totalPage = resp.body.total_page;
		     		this.curPage = page;

		     	}, (err)=>{
		     		Utils.err_process.call(this, err, '请求记录列表失败');
		     	});

		     },

		     reqRecord(){
		     	this.reqRecordData(this.exp_value, this.class_value, this.search_keyword, 1);
		     },

		     loadPage(page){
		     	this.reqRecordData(this.exp_value, this.class_value, this.search_keyword, page);
		     },

		     showRight(row, idx){
		     	//console.log(row);

		     	this.$refs.scoretable.setCurrentRow(this.$refs.scoretable.data[idx]);
		     	//this.$refs.scoretable.toggleRowSelection(this.$refs.scoretable.data[0],true);

		     	this.user_value = row.user_id;
		     	
		     	let api = global_.more_records;

		     	let data = {
		     		//"exper_id": this.exp_value,
		     		"eid": row.eid,
		     		"class_id": row.class_id,
		     		"user_id": row.user_id
		     	};

		     	this.row_exp_value = row.eid;
		     	this.row_class_value = row.class_id;

		     	this.$http.post(api, data).then((resp)=>{
		     		this.records = resp.body;
		     		//console.log(resp);

		     		if (this.records.length == 0) {
		     			Utils.lalert('无记录');
		     			return;
		     			
		     		} else {
		     			this.right_panel = true;
		     			layer.close(this.loading);
		     		}

		     		/*
		     		//row.id仅为最近一次record_id
		     		let api = global_.exp_exam_list;
		     		let data = {
		     			"record_id": row.id
		     		}		 
		     		this.$http.post(api, data).then((resp)=>{
		     			this.exam_records = resp.body;
		     			layer.close(this.loading);

		     		}, (err)=>{
		     			Utils.err_process.call(this, err, '请求实验考核记录失败');
		     		});*/


		     	}, (err)=>{
		     		Utils.err_process.call(this, err, '请求实验考核记录失败');
		     	});
		     },

		     searchReq(){
		     	this.reqRecordData(this.exp_value, this.class_value, this.search_keyword, 1);
		     },

		     /*
		     delRecord(row){
		     	var sure = confirm("确定清除记录？");
		     	if(sure) {
		     		//this.$refs.recordPanel.delCurrent();
		     		this.$refs.recordPanel.delAll();
		     	}
		     }*/

		     loadMore(){
		     	let score_table = document.querySelector(".score_table .el-table__body-wrapper"),
                	scrollTop = score_table.scrollTop,
                	scrollHeight = score_table.scrollHeight,
                	viewHeight = score_table.offsetHeight;

                //console.log(score_table);
                let _this = this;
				this.mousewheel(score_table,
					function(){
	                	if(scrollTop > 0 && scrollTop + viewHeight === scrollHeight) {
	                		if(_this.curPage < _this.totalPage) {
	                			_this.loadPage(_this.curPage + 1);
	                		}
	                	}
					},

					function(){
	 					if (scrollTop === 0) {
	                		if(_this.curPage > 1) {
	                			_this.loadPage(_this.curPage-1);
	                		}
	                	}
					});
                //console.log(scrollTop, viewHeight, scrollHeight);
		     },

			 mousewheel(obj, downfn, upfn) {
		        obj.onmousewheel = fn;
		        if (obj.addEventListener) {
		            obj.addEventListener('DOMMouseScroll', fn, false);
		        }

		        function fn(ev) {
		            let up = true;
		            if (ev.wheelDelta) {
		                up = ev.wheelDelta > 0 ? true : false;
		            } else {
		                up = ev.detail < 0 ? true : false;
		            }

		            if(up) {
		                upfn && upfn();
		            } else {
		                downfn && downfn();
		            }
		            return true;
		        }
			}
		},

		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},

		mounted(){
			Utils.page_check_status.call(this).then(resp=>{
				this.reqExpData(null, resp.body.group);
			});
			this.reqClassData('', '', 1);
			
            let self = this;
              $(".score_table .el-table__body-wrapper").scroll(function(){
                self.loadMore();
            });
		}
	}
</script>


<style type="text/css" scoped>

.pickexptitle {
	display: inline-block;
	line-height: 60px;
}

.teacher-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0;
}

.leftpanel {
	width: 100%; 
	height: 100%;
	margin-right: 42px;
	margin-top: 20px;
}

.rightpanel {
	width: 100%;
	height: 100%; 
	border-left: 1px solid #d7d7d7;
	margin-top: 20px;
}

.pickclasstitle {
	display: inline-block;
}

.tablefooter {
	text-align: center;
}

.rownum {
	display: inline-block;
	margin-top: 20px;
}

.pages {
	display: inline-block;
	margin-left: 20px;
}

.score_table {
	width: 100%; 
	height: 350px; 
	/*overflow-y: scroll;*/
}

.score_table >>> .el-table__body-wrapper{
}
/*
 @media screen and (min-width: 1200px) {
     #teacherview {
        overflow-x:hidden;
    }
}

 @media screen and (min-height: 1200px) {
     #teacherview {
        overflow-y:hidden;
    }
}*/

</style>