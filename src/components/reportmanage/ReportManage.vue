<template>
	<div id="reportmanage">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">实验报告</span>
		</div>	

		<div style="height: 20px;"></div>

		<div class="selectclass">
			<div style="display: inline-block; width: 20px;"></div>
			<div class="pickexptitle">实验： </div>
			<div style="display: inline-block;">
				  <el-select v-model="exp_value" filterable placeholder="请选择所属实验" v-on:change="filterExam()">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>		
			</div>
			<div style="display: inline-block; width: 20px;"></div>
			<div class="pickexamtitle">考核： </div>
			<div style="display: inline-block;">
				  <el-select filterable v-model="exam_value" placeholder="请选择所属考核" v-on:change="">
				    <el-option
				      v-for="item in exam_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>					
			</div>

		</div>

	</div>
</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	import Utils from '../Utils.js';
	export default {
		data(){
			return {
				mod_name: 'report-manage',
				exp_value: '',
				exam_value: '',
				exp_options: [],
				exam_options: []
			}
		},

		methods: {
		    filterExam(){
				asyncReq.call(this);
				async function asyncReq(){
					let examData = await this.examReq.call(this, '', this.exp_value, 0);
					this.exam_options = examData.body._list;
					if(this.exam_options.length > 0) {
						this.exam_value = this.exam_options[0].id;
					} else {
						this.exam_value = '';
					}
				}
		    },

			examReq(keyword, id, page){
				return new Promise((resolve, reject)=>{
					var list_api = global_.exam_list 
								 + '?page=' 
								 + page; 
								 //+ '&pagesize=' 
								 //+ this.rowsPerPage;

					let req_data = {
						'exper_id': id,
						'search': {
							'name': keyword
						}
					};

					this.$http.post(list_api, req_data).then((resp)=>{
						resolve(resp);

					}, (err)=>{
						reject(err);
					});						
				});
			},

			initReq(){
				//call方法可以改变this的指向，指定this指向对象，然后在指定对象的作用域中运行函数
				asyncReq.call(this);
				async function asyncReq(){
					//await只能出现在async函数
					//let expData = await this.expReq.call(this, '', 0);
					let expData = await Utils.reqExpList.call(this, '', 0);
					this.exp_options = expData.body._list;
					this.exp_value = this.exp_options[0].id;

					let examData = await this.examReq.call(this, '', this.exp_value, 0);
					this.exam_options = examData.body._list;
					this.exam_value = this.exam_options[0].id;
				}
			}
		},

		mounted(){
			this.initReq();
		}
	}	
</script>

<style type="text/css" scoped>
.pickexptitle {
	display: inline-block; 
	line-height: 60px;
}

.pickexamtitle {
	display: inline-block;
}
</style>