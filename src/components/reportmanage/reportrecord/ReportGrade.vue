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
			<div class="expand-collapse"></div>
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

			displayNote(){
				let flexibleDiv;
				let container = document.querySelector(".note-group"),
				    hiddendiv = document.querySelector(".expand-collapse");
				 /*   
				if(container.offsetHeight > 50) {
					container.setAttribute("class","note-group collapse");

				}else{
					container.setAttribute("class","note-group");
					container.removeChild(hiddendiv);
				}*/
				container.setAttribute("class","note-group collapse");

				if(container.offsetHeight < 50) {
					console.log(container.offsetHeight);
					container.setAttribute("class","note-group");
					container.removeChild(hiddendiv);					
				}

				container.addEventListener("click", function(){
					if(!flexibleDiv){
						flexibleDiv=hiddendiv;
					}
					if(event.target===flexibleDiv){
						if(container.getAttribute("class").split(" ").indexOf("collapse")!==-1){
							container.setAttribute("class","note-group expand");
						}else{
							container.setAttribute("class","note-group collapse");
						}
					}
				}, false);
			}

			//retrieve fid based on paper_id
			/*
			reqExamQues(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await this.reqPaperCard();
					console.log(resp);
					let api = global_.report_rec_ques;
					let data = {
						'paper_id': resp.body[0][0].paper_id,
						'mode': 2
					}
					
					this.$http.post(api, data).then((resp)=>{
						//prepare for multiple models
						//testing
						let type = resp.body._list.main[0].type;
						let qid = resp.body._list.main[0].question_id;
						console.log(resp.body._list.questions[type][qid].fid);
						let fid = resp.body._list.questions[type][qid].fid;
						let api = global_.report_rec_load + '/' + fid;
						this.$http.post(api, {}).then((resp)=>{
							console.log(resp);
						}, (err)=>{
							console.log(resp);
						});
					}, (err)=>{
						Utils.err_process.call(this, err, '查看试题失败');
					});
				}
			}*/
		},

		/*
		updated(){
			console.log('updated');
			//let note-group_info = window.getComputedStyle(container);
			//console.log(note-group_info.height);
			console.log(container.offsetHeight);
			console.log(document.querySelector(".note-text").offsetHeight);
		},*/

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
				//
				this.reqRecView().then(this.displayNote);
				this.reqFileInfo();
				//this.reqRecView();
				//this.displayNote();
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
}
/*
.note-group {
	position: relative;
	margin-bottom: 20px;
}

.note-group.hidden {
	border: 1px solid red;
	height: 72px;
	overflow: hidden;
}

.note-text {
	font-size: 14px;
	word-break: break-all;
	text-align: justify;
	position: relative;
}*/

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
}

/*
.collapse .note-text::after{
    content: ' ... ';
    position: absolute;
    right: 0;
    bottom: 0;
    padding-left: 20px;
}*/

.expand-collapse {
	/*background: yellowgreen;*/
}

.collapse .expand-collapse::after{
    content: '展开';
    color: #999999;
    display: block;
    width: 100%;
    text-align: right;
}

.expand .expand-collapse::after{
    content: '收起';
    color: #999999;
    display: block;
    width: 100%;
    text-align: right;
}

.collapse .note-text{
    overflow: hidden;
    height: 60px;
}
</style>

