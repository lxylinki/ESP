<template>
	<div id="reportgrade">
		<div class="record-title">
			<span>{{exam_record.exam_name}}</span>
		</div>

		<div class="student-class">
			<span>{{exam_record.student_name}}</span>
			<span>{{exam_record.class_name}}</span>
		</div>

		<div class="start-end-time">
			<span>{{start_time}}</span>&nbsp;
			<span>至</span>&nbsp;
			<span>{{end_time}}</span>
		</div>

		<div class="note-group">
			<p class="note-text">{{exp_note}}</p>
		</div>

		<div class="display-group">
			<embed class="display-area" v-show="fileIsPdf()" :src="file_src" type="application/pdf">

			<div class="display-area" v-show="!fileIsPdf()">
				<img class="thumbnail" src="">
				<label for="thumbnail" class="img-label">{{file_name}}</label>
				<el-button class="addbtn" v-show="!fileIsPdf()" v-on:click="downloadFile()">下载文件</el-button>
			</div>

		</div>
	</div>
</template>

<script type="text/javascript" src="./jquery.media.js"></script>
<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	export default {
		data(){
			return {
				exam_record: {},
				record_id: null,
				exam_id: null,
				start_time: '',
				end_time: '',
				exp_note: '',
				file_src: '',
				file_type: 'pdf',
				file_name: ''
			}
		},

		methods: {
			downloadFile(){
				window.open(this.file_src);
			},

			fileIsPdf(){
				return this.file_type === 'pdf';
			},

			fileIsExcel(){
				return this.file_type === 'sheet';
			},

			fileIsWord(){
				return this.file_type === 'document';
			},

			//retrieve paper_id
			reqPaperCard(){
				return new Promise((resolve, reject)=>{
					let api = global_.report_rec_card;
					let data = {
						'record_id': this.record_id
					}		
					this.$http.post(api, data).then((resp)=>{
						resolve(resp);

					}, (err)=>{
						Utils.err_process.call(this, err, '查看试卷卡失败');
					});	
				});		
			},

			//retrieve file url and type
			reqFileInfo(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await this.reqPaperCard();					
					let fid = resp.body[0][0].answer.split('-')[1];
					this.file_src = global_.report_rec_load + '/' + fid;

					this.$http.get(this.file_src).then((resp)=>{
						//console.log(resp);
						//console.log(resp.body.length);
						let content_type = resp.headers.map['content-type'][0].split(/[^a-z]+/g);
						this.file_type = content_type.pop();
						if(this.fileIsExcel()) {
							$('.thumbnail').attr('src', require('@/assets/excel.svg'));

						} else if(this.fileIsWord()) {
							$('.thumbnail').attr('src', require('@/assets/word.svg'));
						}
					}, (err)=>{
						Utils.err_process.call(this, err, '获取文件信息失败');
					});
				}			
			},

			//view 
			reqRecView(){
				return new Promise((resolve, reject)=>{
					let api = global_.report_rec_view;
					let data = {
						'id': this.exam_id
					}
					this.$http.post(api, data).then((resp)=>{
						this.exp_note = resp.body[0].paper[0].note;
						resolve(resp);
					}, (err)=>{
						Utils.err_process.call(this, err, '查看实验详情失败');
					});
				});
			},
		},

		mounted(){
			let edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {
				this.exam_record = this.$store.state.row;
				//console.log(this.exam_record);
				this.record_id = this.exam_record.id;
				this.exam_id = this.exam_record.exam_id;
				this.start_time = Utils.convTime(this.exam_record.joined_at);
				this.end_time = Utils.convTime(this.exam_record.updated_at);
			
				//this.reqRecView().then(this.displayNote);
				this.reqRecView();
				this.reqFileInfo();
			}			
		}
	}	
</script>

<style type="text/css">
.record-title {
	font-size: 16px;
	font-weight:400;
	line-height:24px;
	margin-bottom: 10px;
}

.start-end-time {
	line-height: 30px;
	border-bottom: 1px solid #d7d7d7;
	margin-bottom: 20px;
}

.display-area {
	width:90%;
	height:500px;
	background:rgba(242,242,242,1);
	text-align: center;
}

.note-group{
    width: 90%;
    position: relative;
}

.note-text{
    font-size: 14px;
    width: 100%;
    height: 60px;
    word-break: break-all;
    text-align: justify;
    color: #666666;
    overflow: hidden;
}

.note-text:hover {
	height: 100%;
}


.expand-collapse {
	background: yellowgreen;
    color: #999999;
    display: block;
    width: 100%;}

.collapse .note-text{
    overflow: hidden;
    height: 60px;
}

.thumbnail {
	position: relative;
	top: 50%;
}
</style>

