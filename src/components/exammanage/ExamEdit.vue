<template>
	<div id='checkadd'>
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">考核管理</span>
		</div>

		<div style="height: 40px;"></div>

		<div>
			<div class='texts'>
				<div> 考核名称： 
					<input class="textin" type="text" v-model="examname">
					<!--<el-input class="usrenter" v-model="usrid" placeholder=""></el-input>-->
					<span class="redalert" v-show="!examname">*</span>
					<span class="whitedefault"v-show="examname">*</span>
					<!---->
				</div>

				<div style="height: 30px;"></div>
				<div> 所属实验： 
					<template>
					  <el-select class="longselect"
					  			 v-model="exp_value" 
					  			 placeholder="请选择">
					    <el-option
					      v-for="item in exp_options"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</template>

					<span class="redalert" v-show="!exp_value">*</span>
					<span class="whitedefault" v-show="exp_value">*</span>
				</div>

				<div style="height: 30px;"></div>
				<div> 题数限制：
					<template>
					  <el-select class="longselect" v-model="qnum_value" placeholder="请选择">
					    <el-option
					      v-for="item in qnum_options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					</template>
					
					<span class="redalert" v-show="!qnum_value">*</span>
					<span class="whitedefault" v-show="qnum_value">*</span>
				</div>
				<div style="height: 30px;"></div>

				<div style="text-align: left; margin-left: 52px;">
					类型：
					<input id="exam" name="examtype" value='1' v-model=type type="radio">考核
					<input id="urgent" name="examtype" value='2' v-model=type type="radio" style="margin-left: 20px;">抢救治疗
				</div>

				<div style="height: 30px;"></div>

				<div class="btn-group">
					<el-button class="confirm" v-on:click='saveEdit()'>确定</el-button>
					<el-button class="goback" v-on:click='goBack()'>返回</el-button>
				</div>
			</div>


		</div>

	</div>
</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	//import storage from '../../assets/js/storage.js';
	import store from '../../vuex/store.js';
	export default{
		data(){
			return {
				id:'',
				type: '',
				examname:'',
				exp_value:'',
				qnum_value:'',

				exp_options:[],
				qnum_options:[
					{
						value: 10,
						label: '10'
					},
					{
						value: 20,
						label: '20'
					},
					{
						value: 30,
						label: '30'
					}
				]
			}
		},

		store: store,

		methods: {
			goBack(){
				this.$router.go(-1);
			},

		    reqExpData(keyword, page){
			    //list request
			    var list_api = global_.exp_list
							 + '?page=' 
							 + page 
							 + '&pagesize=' 
							 + this.rowsPerPage;

				let req_data = {
					"search": {
						"name": keyword
					}
				};

			    this.$http.post(list_api, req_data).then((resp)=>{
			    	//console.log(resp);
			    	this.exp_options = resp.body._list;

			    }, (err)=>{
			    	layer.alert('数据请求失败',{title:'提示', area:['280px','190px']});
			      	console.log(err);
			    });  	
		     },			

			saveEdit(){
				var api = global_.exam_update;
				//console.log(api);
				let data = {
					'id': this.id,
					'name': this.examname,
					'exper_id': this.exp_value,
					'count': this.qnum_value,
					'type': this.type
				};

				this.$http.post(api, data).then((resp)=>{
					layer.alert('编辑保存成功',
						{title:'提示', area:['280px','190px']})
					console.log(resp);
					this.$router.go(-1);

				}, (err)=>{
					layer.alert('后台暂不支持抢救治疗，编辑保存失败',
						{title:'提示', area:['280px','190px']});
					console.log(err);
				});
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
				this.id = row.id;
				this.examname = row.name;
				this.exp_value = row.exper_id;
				this.qnum_value = row.count;
				this.type = row.type;

				if(this.type === '1') {
					document.querySelector('#exam').checked = true;
				}

				if(this.type === '2') {
					document.querySelector('#urgent').checked = true;
				}

				this.reqExpData('', 1);
			}
		}
	}
</script>

<style type="text/css" scoped>

/*to overwrite global style*/
.longselect /deep/ .el-input__inner {
	height: 34px;
	width: 300px;
}

.texts {
	width: 420px;
	height: 300px;
	text-align: right;
}

.texts .btn-group {
	float: left;
	margin-left: 103px;
}

.textin {
	width: 283px;
	height: 30px;
	border: 1px solid #d7d7d7;
	padding-left: 15px;
}

.redalert {
	color: red;
}
.whitedefault {
	/*must be the same with el-main bg color*/
	color: #ffffff;
}

.goback, .goback:hover, .goback:active, .goback:focus{
	color: white;
	background: #d2d5d2;
	border-color: #d2d5d2;
}

.confirm, .confirm:hover, .confirm:active, .confirm:focus{
	background: #31313c;
  	color: white;
  	border-color: #31313c;
}

</style>