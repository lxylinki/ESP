<template>
	<div id="studentview">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">成绩统计</span>
		</div>
		<div style="height: 20px;"></div>

		<div class="selectclass">

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


			<div class="searchwindow student-searchwindow">
				<el-input class="student-searchinput" v-model="search_keyword" v-on:keydown="invokeSearch($event)"  placeholder="请搜索实验名称"></el-input>
				<button class="searchbtn"  v-on:click="searchReq()">
					<i style="color: white;" class="el-icon-search"></i>
				</button>
			</div>

		</div><!--selects-->


		<div style="display: flex; align-items: flex-start;">

			<div class="leftpanel">

			  <!--<div style="height: 30px;"></div>-->
			  <template>
			    <el-table
			      class="score_table"
			      ref="scoretable"
			      height="350px"
			      :highlight-current-row="true"
			      :data="scorelist"
			      @row-click="invokeShowRight"
			      :row-class-name="row_name"
			      style="width: 100%">

					<el-table-column
					  label="序号"
					  :formatter="formatter"
					  min-width="50">
					</el-table-column>	
			      
			      <el-table-column
			        prop="name"
			        label="实验名称"
			        min-width="100">
			      </el-table-column>
			    
	      		  <el-table-column
			        prop="exam_score"
			        label="成绩"
			        min-width="100">
			      </el-table-column>

			      <el-table-column
			        prop=""
			        label="操作"
			        min-width="100">

			       	<template slot-scope="scope">
			      	<!--<el-button type="text" @click="tableData.splice(scope.$index, 1)">-->
			      	<!--<el-button class="op" type="text" @click="delRow(scope.$index)">-->
			      	<el-button class="op" type="text" @click="showRight(scope.row, scope.$index)">
			      		详情 <!--<i class="iconfont" style="color: #0099ff;"> &#xe629;</i>-->
			      	</el-button>

			      </template>
			      </el-table-column>

			    </el-table>
			  </template>
			</div>

			<!--seperate line-->
			<div class="rightpanel">
				<!--<div style="height: 20px;"></div>-->			
				<Records v-if="right_panel"
						 v-bind:class_id = 'class_value'
				         v-bind:records='records'
				         v-bind:isTeacher='isTeacher'
				         style="margin-left: 42px;"></Records>
			</div>			
		</div>


	</div>
</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	import Records from './Records.vue';
	import Utils from '../Utils.js';

	export default {
		data(){
			return {
				mod_name: 'score-stats',
				//exper_id, class_id
				exp_value: '',
				class_value: null,
				exp_options: [],
				class_options: [],
				rowsPerPage: 10,
				scorelist: [],
				isLeft: false,
				search_keyword:'',
				right_panel: false,
				records:[],
				exam_records:[],
				index: 0,
				isTeacher: false,
				loading: null,
				curPage: 1,
				totalPage: 0
			}
		},
		components: {
			'Records': Records,
		},
		
		methods: {
			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},
			
			formatter(row, column ,cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1+ row.ridx);
			},

			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.searchReq();
				}
			},

			invokeShowRight(row){
				this.showRight(row, row.ridx);
			},

			
			reqExpData(keyword, ugroup) {
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this, keyword, ugroup);
			    	this.exp_options = resp.body._list;
			    	if(!this.exp_options) {
			    		layer.close(this.loading);
			    	} else {
				    	this.exp_options.unshift({'name': '所有实验', 'eid': null});
				    	this.exp_value = this.exp_options[0].eid;			    		
			    	}
			    	this.reqRecord();
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
		     		//when body is not null
		     		if(resp.body) {
		     			this.scorelist = resp.body._list;
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
		     	this.isInit = true;
		     	this.$refs.scoretable.setCurrentRow(this.$refs.scoretable.data[idx]);

		     	//console.log(row);
		     	this.class_value = row.class_id;
		     	this.isLeft = true;
		     	let api = global_.more_records;

		     	let data = {
		     		"eid": row.eid,
		     		"class_id": row.class_id,
		     		"user_id": row.user_id
		     	};

		     	this.$http.post(api, data).then((resp)=>{
		     		this.right_panel = true;
		     		this.records = resp.body;
		     		layer.close(this.loading);

		     		/*
		     		let api = global_.exp_exam_list;
		     		let data = {
		     			"record_id": row.id
		     		}		 
		     		this.$http.post(api, data).then((resp)=>{
		     			this.exam_records = resp.body;
		     			//console.log(this.exam_records);
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
		     },

			 mousewheel(obj, downfn, upfn) {
		        obj.onmousewheel = fn;

		        if (obj.addEventListener) {
		            obj.addEventListener('DOMMouseScroll', fn, false);
		        }

		        function fn(ev) {
		            var ev = ev || event;
		            var b = true;
		            if (ev.wheelDelta) {
		                b = ev.wheelDelta > 0 ? true : false;

		            } else {
		                b = ev.detail < 0 ? true : false;
		            }
		            if(b) {
		                upfn&&upfn();

		            } else {
		                downfn&&downfn();
		            }
		            /*
		            if (ev.preventDefault) {
		                ev.preventDefault();
		            }*/
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

.student-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0;
}


.leftpanel {
	width: 100%; 
	height: 100%;
	display: inline-block;
	/*float: left;*/
	margin-right: 42px;
	margin-top: 20px;
}

.rightpanel {
	width: 100%; 
	height: 100%; 
	/*float: left;*/ 
	display: inline-block; 
	border-left: 1px solid #d7d7d7;
	margin-top: 20px;
}

/*
@media screen and (min-width: 1500px) {
     .rightpanel {
        overflow-x:hidden;
    }
}

 @media screen and (min-height: 1200px) {
     .rightpanel {
        overflow-y:hidden;
    }
}*/

.exptitle {
	position: absolute;
	top: 220px;
	left: 310px;	
}

.exp{
	position: absolute;
	top: 217px;
	left: 360px;	
}
</style>