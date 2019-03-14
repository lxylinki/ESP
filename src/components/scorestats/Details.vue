<template>
	<div id="details" class="scorefig">
		
		<div class="qtitle">{{idx+1}}.[{{qtype}}]
		{{detail.question}} ({{detail.score}}分)</div>
		<br>

		<div class="all-options">
			<div class="option">
				<input v-if="this.detail.type == 1" :id="forId('A', idx)" type="radio" :name="forGroup(idx)">
				<label :for="forId('A', idx)"></label>
				<i v-if="this.detail.type == 2 && !this.detail.answer.split('').includes('A')" class="iconfont unchecked-box">&#xe63c;</i>
				<i v-if="this.detail.type == 2 && this.detail.answer.split('').includes('A')" class="iconfont checked-box">&#xe63e;</i>
				<div class="opt-a">A.&nbsp; {{detail.option_a}}</div>				
			</div>

			<div class="option">
				<input v-if="this.detail.type == 1" :id="forId('B', idx)" type="radio" :name="forGroup(idx)">
				<label :for="forId('B', idx)"></label>
				<i v-if="this.detail.type == 2 && !this.detail.answer.split('').includes('B')" class="iconfont unchecked-box">&#xe63c;</i>
				<i v-if="this.detail.type == 2 && this.detail.answer.split('').includes('B')" class="iconfont checked-box">&#xe63e;</i>
				<div class="opt-b">B.&nbsp; {{detail.option_b}}</div>				
			</div>

			<div class="option" v-show="detail.option_c">
				<input v-if="this.detail.type == 1" :id="forId('C', idx)" type="radio" :name="forGroup(idx)">
				<label :for="forId('C', idx)"></label>
				<i v-if="this.detail.type == 2 && !this.detail.answer.split('').includes('C')" class="iconfont unchecked-box">&#xe63c;</i>
				<i v-if="this.detail.type == 2 && this.detail.answer.split('').includes('C')" class="iconfont checked-box">&#xe63e;</i>
				<div class="opt-c">C.&nbsp; {{detail.option_c}}</div>				
			</div>

			<div class="option" v-show="detail.option_d">
				<input v-if="this.detail.type == 1" :id="forId('D', idx)" type="radio" :name="forGroup(idx)">
				<label :for="forId('D', idx)"></label>
				<i v-if="this.detail.type == 2 && !this.detail.answer.split('').includes('D')" class="iconfont unchecked-box">&#xe63c;</i>
				<i v-if="this.detail.type == 2 && this.detail.answer.split('').includes('D')" class="iconfont checked-box">&#xe63e;</i>
				<div class="opt-b">D.&nbsp; {{detail.option_d}}</div>				
			</div>


			<div class="option" v-show="detail.option_e">
				<input v-if="this.detail.type == 1" :id="forId('E', idx)" type="radio" :name="forGroup(idx)">
				<label :for="forId('E', idx)"></label>
				<i v-if="this.detail.type == 2 && !this.detail.answer.split('').includes('E')" class="iconfont unchecked-box">&#xe63c;</i>
				<i v-if="this.detail.type == 2 && this.detail.answer.split('').includes('E')" class="iconfont checked-box">&#xe63e;</i>
				<div class="opt-e">E.&nbsp; {{detail.option_e}}</div>				
			</div>
		</div>


		<div class="qans right-ans-title">正确答案: <span class="rightans">{{detail.answer}}</span></div>
		<div class="qans user-ans-title">你的选择：
			<span class="userans" v-bind:class="{ correct: detail.answer == detail.user_answer, wrong: detail.answer != detail.user_answer }">
				{{detail.user_answer}}
			</span>
		</div>

		<!--<div class="qans" v-if="detail.is_right == 0"><i class="iconfont correctsign">&#xe652;</i></div>-->
		<div class="qans correct-sign" v-if="detail.user_answer == detail.answer"><i class="iconfont correctsign">&#xe652;</i></div>
		<div class="qans error-sign" v-else><i class="iconfont errorsign">&#xe60b;</i></div>
		<div class="accuracy">班级正确率：{{parseInt(detail.accuracy)}}%</div>

		<div class="anls-div">
			<div class="analysis">题目解析:</div>	
			<div class="analysis-detail">{{detail.analysis}}</div>		
		</div>
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

		methods: {
			forId(str, idx) {
				return str+idx;
			},

			forGroup(idx) {
				return this.forId('Group', idx);
			},

			singleAns(){
				if(this.detail.type == 1) {
					let correct_opt = document.getElementById(this.forId(this.detail.answer, this.idx));
					correct_opt.checked = true;
				}
			},
			
			//disable click
			readonlyRadio(){
				let radios = document.querySelectorAll('.option input');
				for(let radio of radios) {
					radio.onclick = function(){return false};
				}
			}
		},

		mounted(){
			//console.log(this.detail);
			if(this.detail.type == 1) {
				this.qtype = '单选';

			} else if(this.detail.type ==2){
				this.qtype = '多选';

			}
			this.singleAns();
			this.readonlyRadio();
		}
	}
</script>

<style type="text/css" scoped>
.option {
	height: 24px;
}
.right-ans-title {
 	margin-top: 10px;
}

.user-ans-title {
	margin-left: 30px;
}

.correct-sign, .error-sign {
	margin-left: 20px;
}

.qtitle {
	font-weight: bold;
}

.correctsign, .correct {
	color: #4fcc66;
}

.errorsign, .wrong {
	color: red;
}

/*
.userans {
	color: #0099ff;
}*/

.qans {
	display: inline-block;
}

/*
.accuracydiv {
	background: #f7f7f7;
	width: 130px;
	height: 40px;
	display: flex;
	position: relative;
	bottom: 60px;
	right: -400px;
}*/

.decor {
	font-size: 24px;
	position: relative;
	bottom: 27px;
	right: -390px;
}

.analysis, .accuracy {
	display: inline-block;
}

.analysis {
	color: #5c9cec;
	margin-top: 10px;
}

.accuracy {
	margin-left: 30px;
}

.analysis-detail {
	box-sizing: border-box;
	padding: 15px;
	width: 80%;
	height: 100px;
	border: 1px solid #d7d7d7;
	margin-bottom: 40px;
}

/*overwrite global settings*/
input[type="radio"] + label::before {
	width: 15px;
	height: 15px;
}

input[type="radio"]:checked + label::before {
	padding: 2px;
}

.checked-box {
	color: #5c9cec;
	cursor: pointer;
	font-size: 150%;
}
.unchecked-box{
	color: #c2c7cb;
	font-size: 150%;
	display: inline-block;
}
.opt-a, .opt-b, .opt-c, .opt-d, .opt-e {
	display: inline-block;
}
</style>