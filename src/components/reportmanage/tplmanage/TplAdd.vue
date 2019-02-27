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
			<span class="whitedefault" v-show="tpl_name">*</span>
		</div>


		<div class="tpl-catag-group">
			<div class="tpl-catag-label">实验分类</div>
			<el-select class="longselect tpl-exp-catag" v-model="catag_value" placeholder="请搜索实验分类名称" filterable>
				<el-option
				  v-for="item in catag_options"
				  :key="item.id"
				  :label="item.name"
				  :value="item.id"
				  :class="{leafcatag: item.isleaf, midcatag: item.ismid, unselectable: !item.isleaf}">
				</el-option>
			</el-select>
			<span class="redalert" v-show="!catag_value">*</span>
			<span class="whitedefault" v-show="catag_value">*</span>
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
			<input class="real-upload-btn" type="file" id="upload-file" v-on:change="up_preCheck($event)" multiple>		
			<el-button class="addbtn upload-btn" >上传文件</el-button>
			<p class="addbtn-limit">仅支持word, excel</p>
			<p class="addbtn-warn" v-show="wrong_format">文件格式错误</p>
			<div class="tpl-upload-fig">
				<img v-show="valid_thumbnail" id="thumbnail" class="thumbnail" src=""><br>
				<label for="thumbnail" class="img-label">{{filename}}</label>
			</div>
		</div>

		<div class="btn-group">
			<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
		</div>

	</div>
</template>

<script type="text/javascript">
	//import MD5 from '@/assets/js/simp-md5.js';
	import global_ from '@/components/Global.js';
	import NewMD5 from '@/assets/js/md5.js';
	import Utils from '@/components/Utils.js';

	export default {
		data(){
			return {
				//user defined file name
				upfile: null,
				wrong_format: false,
				valid_thumbnail: false,
				filename: '',
				tpl_name: '',
				tpl_note: '',
				tpl_score: '',
				catag_value: '',
				catag_options: [],
				support_formats: ['doc', 'docx', 'xls', 'xlsx']
			}
		},
		methods:{
			pre_upload(file) {
				return new Promise((resolve, reject)=>{
					//let fname = event.target.files[0].name,
					let fname = file.name,
					    //md5 = MD5.hex_md5(this.tpl_name);
					    md5 = NewMD5.md5(this.tpl_name);
					let data = {
						"fname": fname,
						"name": this.tpl_name,
						"md5": md5,
						"note": this.tpl_note,
						"thumbnail": null
					}
					let api = global_.report_tpl_preup;
					this.$http.post(api, data).then((resp)=>{
						//console.log(this.upfile);
						resolve(resp);
					}, (err)=>{
						Utils.err_process.call(this, err, '预上传失败');
					});
				});
			},

			real_upload(file) {
				return new Promise((resolve, reject)=>{
					let api = global_.report_tpl_up;

					let formData = new FormData();
					formData.append('resource', file);
					formData.append('single_file', 1);
					formData.append('name', this.tpl_name);

					//formData.append('cid', this.catag_value);
					//formData.append('note', this.tpl_note);
					//formData.append('thumbnail', null);
					this.$http.post(api, formData).then((resp)=>{
						resolve(resp);
					}, (err)=>{
						Utils.err_process.call(this, err, '上传失败');
					});
				});
			},

			up_preCheck(event){
				if(!this.tpl_name) {
					Utils.lalert('请输入模板名称');
					return;			
				} else {
					this.upload(event);
				}				
			},

			preCheck(){
				if(!this.tpl_name) {
					Utils.lalert('请输入模板名称');
					return;			

				} else if(!this.catag_value){
					Utils.lalert('请选择实验分类');
					return;

				} else {
					this.addCreate();
				}
			},

			addCreate() {
				let _this = this;

				//create template
				function last(real_resp) {
					console.log(real_resp.body);
					let api = global_.report_tpl_create;
					let data = {
						'name': _this.tpl_name,
						'single_file': 1,
						'cid': _this.catag_value,
						'note': _this.tpl_note,
						'rid': real_resp.body.id,
						'score': _this.tpl_score
					}
					_this.$http.post(api, data).then((resp)=>{
						//console.log(resp);
						Utils.lalert('模板创建成功');
						_this.$router.go(-1);

					}, (err)=>{
						//TODO: add precheck
						Utils.err_process.call(_this, err, '模板创建失败');
					});
				}

				function next(pre_resp){
					if(pre_resp.body.id && pre_resp.body.fid) {
						// file exists
						return;
					} else {
						// need to real upload
						_this.real_upload.call(_this, _this.upfile).then(last);
					}
				}

				if(this.upfile) {
					this.pre_upload(this.upfile).then(next);
				} else {
					Utils.lalert('未选择文件');
				}
			},

			setThumbnail(format){
				if(this.support_formats.includes(format)){
					this.valid_thumbnail = true;
					this.wrong_format = false;
					if(format === 'xls' || format ==='xlsx') {
						$('.thumbnail').attr('src', require('@/assets/excel.svg'));
					} else if(format === 'doc' || format ==='docx') {
						$('.thumbnail').attr('src', require('@/assets/word.svg'));
					}
				} else {
					this.wrong_format = true;
					this.valid_thumbnail = false;
					return;
				}
			},

			upload(event){
				//save the file
				if(event.srcElement.files.length>0) {
					this.upfile = event.srcElement.files[0];	
					let format = this.upfile.name.split('.').pop();
					this.setThumbnail(format);
					this.filename = this.upfile.name;

				} else {
					Utils.lalert('未选择文件');
					return;
				}
				
				let _this = this;
				function next(pre_resp){
					if(pre_resp.body.id && pre_resp.body.fid) {
						// file exists
						Utils.lalert('文件已存在');
						return;
					} else {
						// need to real upload
						_this.real_upload.call(_this, _this.upfile);
					}
				}
				this.pre_upload(_this.upfile).then(next);
			},

			goBack(){
				this.$router.go(-1);
			},

		    decorFileInp(){
				let upbtn = document.querySelector(".upload-btn"),
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
					//console.log(this.catag_options);				
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
	text-align: center;
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
.unselectable {
	color: #d7d7d7;
	pointer-events: none;
}

.addbtn-limit {
	display: inline-block;
	font-size: 14px;
	margin-left: 20px;
	color: #999999;
}

.addbtn-warn {
	display: inline-block;
	font-size: 14px;
	margin-left: 20px;
	color: red;
}

.thumbnail {
	width:43px;
	height:56px;
	position: relative;
	top: 10px;
}
.img-label {
	font-size: 14px;
	position: relative;
	color: #999999;
}
</style>