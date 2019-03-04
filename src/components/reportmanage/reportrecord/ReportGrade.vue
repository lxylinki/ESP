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
			<span>{{start_time}}</span><span>至</span>
			<span>{{end_time}}</span>
		</div>
	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	export default {
		data(){
			return {
				exam_record: {},
				record_id: null,
				start_time: '',
				end_time: ''
			}
		},

		methods: {
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

			//retrieve fid based on paper_id
			reqExamQues(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await this.reqPaperCard();
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
						let api = global_.report_rec_load + fid;
						this.$http.post(api, {}).then((resp)=>{
							console.log(resp);
						}, (err)=>{
							console.log(resp);
						});
					}, (err)=>{
						Utils.err_process.call(this, err, '查看试题失败');
					});
				}
			}
		},

		mounted(){
			let edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {
				this.exam_record = this.$store.state.row;
				this.record_id = this.exam_record.id;
				this.start_time = Utils.convTime(this.exam_record.joined_at);
				this.end_time = Utils.convTime(this.exam_record.updated_at);
				//
				this.reqExamQues();
			}			
		}
	}	
</script>

<style type="text/css">
	
</style>

