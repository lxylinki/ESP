<template>
	<div id="tpladd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>模板管理</span>
		</div>	
		
		<div class="tpl-name-group">
			<div class="tpl-name-label">模板名称</div>
			<input class="tpl-name longinput" type="text" v-model="tpl_name" placeholder="必填">
			<span class="redalert" v-show="!tpl_name">*</span>
			<span class="whitedefault"v-show="tpl_name">*</span>
		</div>

		<div class="tpl-catag-group">
			<div class="tpl-catag-label">实验分类</div>
			<el-select class="longselect tpl-exp-catag" v-model="catag_value" placeholder="请搜索实验分类名称" filterable>
				<el-option
				  v-for="item in catag_options"
				  :key="item.id"
				  :label="item.name"
				  :value="item.id"
				  :class="{leafcatag: item.isleaf, midcatag: item.ismid, unselectable: item.isleaf}">
				</el-option>
			</el-select>
			<span class="redalert" v-show="!catag_value">*</span>
			<span class="whitedefault"v-show="catag_value">*</span>
		</div>

		<div class="tpl-note-group">
			<div class="tpl-note-label">模板备注</div>
			<textarea class="tpl-note" v-model="tpl_note"></textarea>
		</div>

		<div class="tpl-score-group">
			<div class="tpl-score-label">模板分数</div>
			<input class="tpl-score" type="text" v-model="tpl_score">
		</div>

		<div class="tpl-up-group">
			<div class="tpl-up-label">模板上传</div>
			<input class="real-upload-btn" type="file" id="upload-file" v-on:change="upFile($event)" multiple>		
			<el-button class="addbtn upload-btn">上传文件</el-button>
			<div class="tpl-upload-fig"></div>
		</div>

		<div class="btn-group">
			<el-button class="confirm" v-on:click="">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
		</div>

	</div>
</template>

<script type="text/javascript">
	import MD5 from '@/assets/js/md5.js';
	import global_ from '@/components/Global.js';

	export default {
		data(){
			return {
				//user defined file name
				tpl_name: '',
				tpl_note: '',
				tpl_score: '',
				catag_value: '',
				catag_options: []
			}
		},
		methods:{
			preup(event){
				let fname = event.target.files[0].name,
				//api report error
				    md5 = MD5.hex_md5(this.tpl_name);

				let data = {
					"fname": fname,
					"name": this.tpl_name,
					"md5": md5,
					"note": this.note,
					"thumbnail": null
				}

				let api = global_.report_tpl_preup;
				this.$http.post(api, data).then((resp)=>{
					console.log(resp);
				}, (err)=>{
					console.log(err);
				});
			},

			upFile(event) {
				this.preup(event);
				/*
				let formData = new FormData();
				let real_filename = event.target.files[0].name;
				//actual file name
				console.log(real_filename);
				formData.append("resource", event.target.files[0]);
				let api = global_.report_tpl_create;
				this.$http.post(api, formData).then((response)=>{
				}, (err)=>{
					console.log(err);
				});*/
			},

			goBack(){
				this.$router.go(-1);
			},

		    decorFileInp(){
				var upbtn = document.querySelector(".upload-btn"),
				    upfile = document.querySelector("#upload-file");
				 
				upbtn.addEventListener("click", function(e) {
					if (upfile) {
						upfile.click();
					}
					// prevent navigation to "#"
					e.preventDefault();
					}, false
				);
		    },

			reqCatagList(){
				//console.log(this.catag_options);
				this.catag_options = [];
				let api = global_.expcatag_list;
				let data = {
					'all': 1
				}
				this.$http.post(api, data).then((resp)=>{
					this.expandCatag(this.catag_options, resp.body);				
					this.filtered_catags = this.catag_options;
					//this.filtered_catags.unshift({'id': null, 'name': '全部分类'});

				}, (err)=>{
					//console.log(err);
					Utils.err_process.call(this, err, '请求实验分类列表失败');
				});				
			},

			expandCatag(arr, tree){
				for(let i of tree) {
					if(i.level == -1 && i.pid) {
						i.isleaf = true;
					} else if(i.level == 1) {
						i.isroot = true;
					} else if(i.level == 2) {
						i.ismid = true;
					}
					arr.push(i);
					if(i.hasOwnProperty('sub_categories')) {
						this.expandCatag(arr, i.sub_categories)
					}
				}
			},
		},

		mounted(){
			//alert(MD5.hex_md5('123'));
			this.decorFileInp();
			this.reqCatagList();
		}
	}
</script>

<style type="text/css" scoped>
.tpl-name, .longselect /deep/ .el-input__inner {
	box-sizing: border-box;
	width:500px;
	height:36px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,1);
	border-radius:4px;
}

.tpl-name-label, .tpl-note-label, .tpl-score-label, .tpl-up-label, .tpl-catag-label {
	margin-left: 30px;
	margin-right: 30px;
}

.tpl-name-label, .tpl-name, .tpl-note-label, .tpl-note, .tpl-score-label, 
.tpl-score, .tpl-up-label, .tpl-up, .tpl-catag-label, .tpl-exp-catag {
	display: inline-block;
}

.tpl-note {
	box-sizing: border-box;
	padding: 15px;
	width:500px;
	height:100px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,1);
	border-radius:4px;	
	vertical-align: top;
}
.tpl-name-group {
	margin-top: 30px;
}
.tpl-name-group, .tpl-note-group, .tpl-score-group, .tpl-up-group, .tpl-catag-group {
	margin-bottom: 30px;
}

.tpl-score {
	width:50px;
	height:28px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,1);
	border-radius:2px;
	text-align: center;
}

#upload-file {
	display: none;
}

.tpl-upload-fig {
	width:500px;
	height:118px;
	background:rgba(241,241,241,1);
	border-radius:4px;
	margin-left:130px;
	margin-top: 30px;
}

.btn-group {
	margin-left: 130px;
}

.leafcatag {
	padding-left: 35px;
	color: #757575;
}

.midcatag {
	padding-left: 25px;
	color: #757575;
}
.redalert {
	color: red;
}
.whitedefault {
	/*must be the same with bg color*/
	color: #ffffff;
}

</style>