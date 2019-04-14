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
			<div class="display-area" v-show="fileIsPdf()">
				<embed :src="file_src" type="application/pdf" align="left">
				<el-button class="full-screen-btn addbtn" v-on:click="downloadFile()">进入全屏</el-button>
			</div>

			<div class="display-area" v-show="!fileIsPdf()">
				<img class="thumbnail" src=""><br>
				<label for="thumbnail" class="img-label">{{file_name}}</label><br>
				<label for="thumbnail" class="img-label">文件阅读后在此页面进行批阅</label><br>
				<el-button class="addbtn" v-show="!fileIsPdf()" v-on:click="downloadFile()">下载文件</el-button>
			</div>
		</div>

		<div class="grade-group">
			<div class="graded-div">
				<i class="iconfont unchecked-box" v-show="!graded" v-on:click="toggleGraded()">&#xe63c;</i>
				<i class="iconfont checked-box" v-show="graded" v-on:click="toggleGraded()">&#xe63e;</i>
				<span class="graded-title">已批阅</span>
			</div>

			<div class="full-score-div">
				<span class="full-score-title">总分： {{full_score}}分</span>
			</div>
			

			<div class="grade-inp-div">
				<span class="grade-title">批改</span>
				<input class="grade-inp" type="text" v-model="graded_score">
				<span class="grade-title">分</span>				
			</div>

		</div>

		<div class="comment-group">
			<textarea class="comment" placeholder="请填写评语..." v-model="comment"></textarea>
		</div>

		<div class="btn-group">
			<el-button class="confirm" v-on:click="submitGrade()">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
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
				paper_id: null,
				start_time: '',
				end_time: '',
				exp_note: '',
				file_src: '',
				file_type: 'pdf',
				file_name: '',
				full_score: 0,
				graded_score: 0,
				graded: false,
				comment: ''
			}
		},

		methods: {
			toggleGraded(){
				this.graded = !this.graded;
			},

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
						//this.paper_id = resp.body[0][0].paper_id;
						//console.log('reqPaperCard', resp);
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
					//this.paper_id = resp.body[0][0].paper_id;
					this.file_name = fid;
					this.file_src = global_.report_rec_load + '/' + fid;

					this.$http.get(this.file_src).then((resp)=>{
						//console.log(resp);
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
						let data = resp.body[0];
						this.exp_note = data.paper[0].note;
						this.full_score = data.full_score;
						this.start_time = Utils.convTime(data.started_at);
						this.end_time = Utils.convTime(data.ended_at);
						resolve(resp);
					}, (err)=>{
						Utils.err_process.call(this, err, '查看实验详情失败');
					});
				});
			},

			//retrieve order and type_order
			reqRecQues(){
				return new Promise((resolve, reject)=>{
					asyncReq.call(this);
					async function asyncReq(){
						let resp = await this.reqPaperCard();				
						this.paper_id = resp.body[0][0].paper_id;

						let api = global_.report_rec_ques;
						let data = {
							'paper_id': this.paper_id,
							'mode': 2
						}
						this.$http.post(api, data).then((resp)=>{
							resolve(resp.body._list.main[0]);

						}, (err)=>{
							Utils.err_process.call(this, err, '获取试题信息失败');
						});
					}
				});
			},

			//submit the graded score number
			subScore(){
				//this.reqRecQues().then(resp=>{console.log(resp)});
				return new Promise((resolve, reject)=>{
					asyncReq.call(this);
					async function asyncReq(){
						let resp = await this.reqRecQues(),
							api = global_.report_mark,
							data = {
								'order': resp.order,
								'type_order': resp.type_order,
								'record_id': this.record_id,
								'score': this.graded_score
							};
						this.$http.post(api, data).then((resp)=>{
							Utils.lalert('提交分数成功');
							resolve(resp);
						}, (err)=>{
							Utils.err_process.call(this, err, '提交分数失败');
						});
					}
				});
			},

			//final step to graded
			subText(){
				let api = global_.report_rec_mark;
				let data = {
					'id': this.record_id,
					'mark_text': this.comment,
					'has_marked': this.graded?1:0
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('提交评语成功');
				}, (err)=>{
					Utils.err_process.call(this, err, '提交评语失败');
				});
			},

			displayNote(){
				let content = document.querySelector('.note-text');
				//console.log(content.offsetHeight);
				if(content.offsetHeight < 60) {
					content.setAttribute('class', 'note-text short');
				} else {
					content.setAttribute('class', 'note-text long');
				}
			},

			goBack(){
				this.$router.go(-1);
			},

			submitGrade(){
				this.graded = true;
				this.subScore().then(this.subText);
			}
		},

		mounted(){
			Utils.page_check_status.call(this);
			let edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {
				this.exam_record = this.$store.state.row;
				//console.log(this.exam_record);

				this.record_id = this.exam_record.id;
				this.exam_id = this.exam_record.exam_id;
				// this.start_time = Utils.convTime(this.exam_record.joined_at);
				// this.end_time = Utils.convTime(this.exam_record.updated_at);
				this.graded_score = this.exam_record.score;
				this.graded = this.exam_record.has_marked == 1?true:false;
				this.comment = this.exam_record.mark_text;

			
				this.reqRecView().then(this.displayNote);
				this.reqFileInfo();
			}			
		}
	}	
</script>


<style type="text/css" scoped>
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

.note-group{
    width: 1140px;
    height: 100%;
}

.note-text {
    font-size: 14px;
    width: 100%;
    word-break: break-all;
    text-align: justify;
    color: #666666;
    overflow: hidden;
}

/*100% < 60px*/
.note-text.short, .note-text.long {
	height: 60px;
}
.note-text.short:hover {
	height: 60px;
}
/*100% > 60px*/
.note-text.long:hover {
	height: 100%;
}
.display-group {
	position: relative;
	text-align: center;
}

.display-area, .display-area embed {
	width:1140px;
	height:500px;
	background:rgba(242, 242, 242, 1);
	margin-bottom: 20px;
}

.thumbnail {
	position: relative;
	top: 120px;
}

.addbtn {
	position: relative;
	top: 140px;
}

.full-screen-btn.addbtn {
	position: relative;
	top: -80px;
	margin-left: auto;
	margin-right: auto;
}

.img-label {
	position: relative;
	top: 130px;
	color: #666666;
}
.unchecked-box, .checked-box {
	color: #5c9cec;
	cursor: pointer;
	font-size: 180%;
	vertical-align: middle;
}

.grade-group {
	display: flex;
	justify-content: flex-start;
	align-items: baseline;
	margin-top: 20px;
	margin-bottom: 20px;
	width:1140px;
	height:56px;
	background:rgba(241, 244, 248, 1);
	position: absolute;
	top: 700px;
}

.grade-inp {
	width:50px;
	height:28px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(204,204,204,1);
	border-radius:2px;
	font-size: 13px;
	text-align: center;
}

.comment-group {
	position: absolute;
	top: 795px;
	margin-bottom: 100px;
}

.comment {
	width:1140px;
	height:100px;
	border:1px solid rgba(204,204,204,1);
}

.graded-div, .full-score-div, .grade-inp-div {
	margin-right: 30px;
	margin-top: 10px;
}

.graded-div {
	margin-left: 10px;
}

.btn-group {
	position: absolute;
	top: 930px;
}

.comment {
	padding: 15px;
	box-sizing: border-box;
}

</style>
