<template>
	<div id="details" class="scorefig">
		
		<div class="qtitle">{{idx+1}}.[{{qtype}}]
		{{detail.question}} ({{detail.score}}分)</div>
		
		<br>

		<!--<div class="qans" v-if="detail.is_right == 0"><i class="iconfont correctsign">&#xe652;</i></div>-->
		<div class="qans" v-if="detail.user_answer == detail.answer"><i class="iconfont correctsign">&#xe652;</i></div>
		<div class="qans" v-else><i class="iconfont errorsign">&#xe60b;</i></div>

		<div class="qans" style="margin-left: 30px;">你的选择：<span class="userans">{{detail.user_answer}}</span></div>
		<div class="qans" style="margin-left: 30px;">正确答案: <span class="rightans">{{detail.answer}}</span></div>

		<div v-bind:class="{ correct: detail.answer == 'A' }">A. {{detail.option_a}}</div>
		<div v-bind:class="{ correct: detail.answer == 'B' }">B. {{detail.option_b}}</div>
		<div v-show="detail.option_c" v-bind:class="{ correct: detail.answer == 'C' }">C. {{detail.option_c}}</div>
		<div v-show="detail.option_d" v-bind:class="{ correct: detail.answer == 'D' }">D. {{detail.option_d}}</div>
		<div v-show="detail.option_e" v-bind:class="{ correct: detail.answer == 'E' }">E. {{detail.option_e}}</div>

		<div class="analysis">题目解析: {{detail.analysis}}</div>

		<div class="decor">|</div>
		<div class="accuracydiv">
			<div class="accuracy">班级正确率：{{parseInt(detail.accuracy)}}%</div>
		</div>

		<hr>

	</div>
</template>

<script type="text/javascript">
	export default {
		props:['detail','idx'],
		data(){
			return {
				qtype:'',
			}
		},

		mounted(){
			console.log(this.detail);

			if(this.detail.type == 1) {
				this.qtype = '单选';

			} else if(this.detail.type ==2){
				this.qtype = '多选';
			}
		}
	}
</script>

<style type="text/css" scoped>
.qtitle {
	font-weight: bold;
}

.correctsign, .rightans, .correct{
	color: #4fcc66;
}

.errorsign {
	color: red;
}

.userans {
	color: #0099ff;
}

.qans {
	display: inline-block;
}

.analysis {
	position: relative;
	top: 20px;
}

.accuracydiv {
	background: #f7f7f7;
	width: 130px;
	height: 40px;
	display: flex;
	position: relative;
	bottom: 60px;
	right: -400px;
}

.decor {
	font-size: 24px;
	position: relative;
	bottom: 27px;
	right: -390px;
}

.accuracy {
	margin: auto;
	align-self: center;
}
</style>