<template>
	<div id="questionadd">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">试题管理</span>
		</div>
		
		<div style="height: 30px;"></div>

		<div class="questype">
			<div id="tp">
				题型： 
			</div>

			<div class="schoice">
				<input type="radio" name="qtype" value='1' v-model="type">
				<span>单选</span>
			</div>
			
			<div class="mchoice">
				<input type="radio" name="qtype" value='2' v-model="type">
				<span>多选</span>
			</div>
		</div>

		<div style="height: 40px;"></div>
		
		<div class="question">
			<div id="ques">
				题干：
			</div>
				
			<div id="quesbody">
				<el-input type="textarea" 
						  class="questionbody" 
						  v-model="question"></el-input>
			</div>
		</div>

		<div style="height: 40px;"></div>

		<div class="answers">
			<div class="ansopt">答案选项</div>
			<div class="adddel">增加/删除</div>
			<div class="rightopt">正确选项</div>
			<div class="mvupdown">上移下移</div>
		</div>

		<div style="height: 30px;"></div>


		<div class="opts">
<!------------------------------------------------------------------------------------------------------------------------>
			<div class="answera" v-show="showA">
				<div style="display: inline-block; margin-left: 30px; margin-right: 20px;">选项A</div>

				<!--input-->
				<div style="display: inline-block; margin-right: 20px;">
					<input class="longinput" type="text" v-model="aval">
				</div>
				
				<!--add-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%;" 
					   class="iconfont" 
					   v-on:click="aAddNewOpt()"
					   v-show="!showE">
						&#xe62d;
					</i>
					<i style="color: #ffffff; font-size: 150%;" class="iconfont" v-show="showE">&#xe62d;</i>
				</div>
				
				<!--del-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%; margin-right: 20px;" 
					   class="iconfont" 
					   v-on:click="delA()"
					   v-show="showC">&#xe6a9;</i>
					<i style="color: #ffffff; font-size: 150%; margin-right: 20px;" 
					   class="iconfont" 
					   v-show="!showC">&#xe6a9;</i>
				</div>
				
				<!--correct one-->
				<div style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox"
						   id="aCheck"
						   v-on:change="checkA()" 
						   type="checkbox">
				</div>
				
				<!--move up-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%; margin-left: 20px;" class="iconfont">&#xe7c6;</i>
				</div>

				<!--move down-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%;" class="iconfont" v-on:click="mvDownA()">&#xe8ed;</i>
				</div>
				<div style="height: 20px;"></div>
			</div>
<!----------------------------------------------------------------------------------------------------------------------->
			<div class="answerb" v-show="showB">
				<!--title-->
				<div style="display: inline-block; margin-left: 30px; margin-right: 20px;">选项B</div>

				<!--input-->
				<div style="display: inline-block; margin-right: 20px;">
					<input class="longinput" type="text" v-model="bval">
				</div>
				<!--add-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%;" 
					   class="iconfont" 
					   v-on:click="bAddNewOpt()"
					   v-show="!showE">
						&#xe62d;
					</i>
					<i style="color: #ffffff; font-size: 150%;" class="iconfont" v-show="showE">&#xe62d;</i>
				</div>
				<!--del-->
				<div style="display: inline-block;" >
					<i style="color: #333333; font-size: 150%; margin-right: 20px;" 
					   class="iconfont" 
					   v-on:click="delB()"
					   v-show="showC">&#xe6a9;</i>
					<i style="color: #ffffff; font-size: 150%; margin-right: 20px;" 
					   class="iconfont" 
					   v-show="!showC">&#xe6a9;</i>
				</div>
				
				<!--correct-->
				<div style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox" 
						   type="checkbox"
						   id="bCheck"
						   v-on:change="checkB()">
				</div>
				<!--move up-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%; margin-left: 20px;" class="iconfont" v-on:click="mvUpB()">&#xe7c6;</i>
				</div>
				<!--move down-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%;" class="iconfont" v-on:click="mvDownB()">&#xe8ed;</i>
				</div>
				<div style="height: 20px;"></div>
			</div>

<!-------------------------------------------------------------------------------------------------------------------------->
			<div class="answerc" v-show="showC">
				<!--title-->
				<div style="display: inline-block; margin-left: 30px; margin-right: 20px;">选项C</div>

				<!--input-->
				<div style="display: inline-block; margin-right: 20px;">
					<input class="longinput" type="text" v-model="cval">
				</div>
				<!--add-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%;" 
					   class="iconfont" 
					   v-on:click="cAddNewOpt()"
					   v-show="!showE">
						&#xe62d;
					</i>
					<i style="color: #ffffff; font-size: 150%;" class="iconfont" v-show="showE">&#xe62d;</i>
				</div>
				<!--del-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%; margin-right: 20px;" 
					   class="iconfont" 
					   v-on:click="delC()">&#xe6a9;</i>
				</div>
				<!--correct-->
				<div style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox" 
						   type="checkbox"
						   id="cCheck"
						   v-on:change="checkC()">
				</div>
				<!--move up-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%; margin-left: 20px;" class="iconfont" v-on:click="mvUpC()">&#xe7c6;</i>
				</div>
				<!--move down-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%;" class="iconfont" v-on:click="mvDownC()">&#xe8ed;</i>
				</div>
				<div style="height: 20px;"></div>
			</div>

			
<!-------------------------------------------------------------------------------------------------------------------------->
			<div class="answerd" v-show="showD">
				<!--title-->
				<div style="display: inline-block; margin-left: 30px; margin-right: 20px;">选项D</div>

				<!--input-->
				<div style="display: inline-block; margin-right: 20px;">
					<input class="longinput" type="text" v-model="dval">
				</div>
				
				<!--add-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%;" 
					   class="iconfont" 
					   v-on:click="dAddNewOpt()"
					   v-show="!showE">
						&#xe62d;
					</i>
					<i style="color: #ffffff; font-size: 150%;" class="iconfont" v-show="showE">&#xe62d;</i>
				</div>
				
				<!--del-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%; margin-right: 20px;" class="iconfont" v-on:click="delD()">&#xe6a9;</i>
				</div>
				
				<!--correct one-->
				<div style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox" 
						   type="checkbox"
						   id="dCheck" 
						   v-on:change="checkD()">
				</div>
				
				<!--move up-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%; margin-left: 20px;" class="iconfont" v-on:click="mvUpD()">&#xe7c6;</i>
				</div>

				<!--move down-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%;" class="iconfont" v-on:click="mvDownD()">&#xe8ed;</i>
				</div>

				<div style="height: 20px;"></div>
			</div>

			
<!----------------------------------------------------------------------------------------------------------------------------->
			<div class="answere" v-show="showE">
				<!--title-->
				<div style="display: inline-block; margin-left: 30px; margin-right: 20px;">选项E</div>
				<!--input-->
				<div style="display: inline-block; margin-right: 20px;">
					<input class="longinput" type="text" v-model="eval">
				</div>
				<!--add-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%;" 
					   class="iconfont" 
					   v-on:click="eAddNewOpt()"
					   v-show="!showE">
						&#xe62d;
					</i>
					<i style="color: #ffffff; font-size: 150%;" class="iconfont" v-show="showE">&#xe62d;</i>
				</div>
				<!--del-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 150%; margin-right: 20px;" class="iconfont" v-on:click="delE()">&#xe6a9;</i>
				</div>
				<!--correct one-->
				<div style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox" 
						   type="checkbox"
						   id="eCheck"
						   v-on:change="checkE()">
				</div>
				<!--move up-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%; margin-left: 20px;" class="iconfont" v-on:click="mvUpE()">&#xe7c6;</i>
				</div>
				<!--move down-->
				<div style="display: inline-block;">
					<i style="color: #333333; font-size: 170%;" class="iconfont">&#xe8ed;</i>
				</div>
				<div style="height: 20px;"></div>
			</div>

			

		<div class="analysis">
			<div id="anls" style="display: inline-block; vertical-align: top;">
				题目解析：
			</div>	
			<div id="anlsbody" style="display: inline-block; margin-bottom: 100px;">
				<el-input type="textarea" class="analysisbody" v-model="analyze"></el-input>
			</div>
		</div>
		
		
		
		<div class="btn-group">
			<el-button class="confirm" v-on:click="addCreate()">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
			<div style="height: 40px;"></div>
		</div>

		</div>

	
	</div>

</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	import store from '../../vuex/store.js';

	export default {
		store:store,
		data(){
			return{
				mod_name: 'ques-manage',
				showA: true,
				showB: true,
				showC: false,
				showD: false,
				showE: false,

				aval:'',
				bval:'',
				cval:'',
				dval:'',
				eval:'',

				aCorrect:false,
				bCorrect:false,
				cCorrect:false,
				dCorrect:false,
				eCorrect:false,

				mchoice:false,

				//1 单选 2 多选
				type:'',
				question:'',
				exam_id:'',
				answer:'',
				answers:[],
				analyze:''
			}
		},

		methods: {
			rmanswer( answers, ans){
				var idx = answers.indexOf(ans);
				answers.splice(idx, 1);
				//console.log(this.answers);				
			},

			getAnswers(answers){
				var ans = '';
				for(var i in answers) {
					ans += answers[i];
				}
				//console.log(ans);
				return ans;
			},

			checkA(){
				//when single choice and A is checked
				var opta = document.querySelector('#aCheck');
				if(opta.checked && this.type == 1){

					this.answer = 'a';
					document.querySelector('#bCheck').checked = false;
					document.querySelector('#cCheck').checked = false;
					document.querySelector('#dCheck').checked = false;
					document.querySelector('#eCheck').checked = false;
					
					// when multi-choice and A is checked
				} else if(opta.checked && this.type == 2){
					this.answers.push('a');

					//when multi-choice and A is unchecked
				} else if(!opta.checked && this.type == 2) {
					this.rmanswer(this.answers, 'a');
				}

			},
			checkB(){
				var optb = document.querySelector('#bCheck');
				if(optb.checked && this.type == 1){

					this.answer = 'b';
					document.querySelector('#aCheck').checked = false;
					document.querySelector('#cCheck').checked = false;
					document.querySelector('#dCheck').checked = false;
					document.querySelector('#eCheck').checked = false;

				} else if(optb.checked && this.type == 2) {
					this.answers.push('b');

				} else if(!optb.checked && this.type == 2) {
					this.rmanswer(this.answers, 'b');
				}
			},
			checkC(){
				var optc = document.querySelector('#cCheck');
				if(optc.checked && this.type == 1) {
					this.answer = 'c';
					document.querySelector('#aCheck').checked = false;
					document.querySelector('#bCheck').checked = false;
					document.querySelector('#dCheck').checked = false;
					document.querySelector('#eCheck').checked = false;

				} else if(optc.checked && this.type == 2) {
					this.answers.push('c');

				} else if(!optc.checked && this.type == 2) {
					this.rmanswer(this.answers, 'c');
				}
			},
			checkD(){
				var optd = document.querySelector('#dCheck');
				if(optd.checked && this.type == 1) {
					this.answer = 'd';
					document.querySelector('#aCheck').checked = false;
					document.querySelector('#bCheck').checked = false;
					document.querySelector('#cCheck').checked = false;
					document.querySelector('#eCheck').checked = false;	

				}else if(optd.checked && this.type == 2) {
					this.answers.push('d');

				}else if(!optd.checked && this.type == 2) {
					this.rmanswer(this.answers, 'd');
				}	
			},
			checkE(){
				var opte = document.querySelector('#eCheck');
				if(opte.checked && this.type == 1) {

					document.querySelector('#aCheck').checked = false;
					document.querySelector('#bCheck').checked = false;
					document.querySelector('#cCheck').checked = false;
					document.querySelector('#dCheck').checked = false;	

				} else if (opte.checked && this.type == 2) {
					this.answers.push('e');
				} else if (!opte.checked && this.type == 2) {
					this.rmanswer(this.answers, 'e');
				}
			},

			aAddNewOpt(){
				//if A is empty or E is present or B is present and empty
				if(this.showE) {
					return;
				} else {
					if (this.showD) {
						this.showE = true;
						this.eval = this.dval;
						this.dval = this.cval;
						this.cval = this.bval;
						this.bval = '';

					} else if (this.showC) {
						this.showD = true;
						this.dval = this.cval;
						this.cval = this.bval;
						this.bval = '';

					} else if (this.showB) {
						this.showC = true;
						this.cval = this.bval;
						this.bval = '';

					} else {
						this.bval = '';
						this.showB = true;
					}
				}
			},
			delA(){
				if (this.showE){
					this.aval = this.bval;
					this.bval = this.cval;
					this.cval = this.dval;
					this.dval = this.eval;
					this.eval = '';
					this.showE = false;

				} else if (this.showD) {
					this.aval = this.bval;
					this.bval = this.cval;
					this.cval = this.dval;
					this.dval = '';
					this.showD = false;

				} else if (this.showC) {
					this.aval = this.bval;
					this.bval = this.cval;
					this.cval = '';
					this.showC = false;

				} else if (this.showB) {
					this.aval = this.bval;
					this.bval = '';
					this.showB = false;

				} else {
					this.aval = '';
					//set add btn not visible
					//cannot delete when 1 opt left
				}
			},
			mvDownA(){
				if(this.showB) {
					var a = this.aval;
					this.aval = this.bval;
					this.bval = a;					
				}
			},


			bAddNewOpt(){
				if(this.showE) {
					return;
				} else {
					if(this.showD) {
						this.showE = true;
						this.eval = this.dval;
						this.dval = this.cval;
						this.cval = '';

					} else if (this.showC) {
						this.showD = true;
						this.dval = this.cval;
						this.cval = '';

					} else {
						this.showC = true;
						this.cval = '';
					}
				}
			},
			delB(){

				if(this.showE) {
					this.bval = this.cval;
					this.cval = this.dval;
					this.dval = this.eval;
					this.eval = '';
					this.showE = false;

				} else if (this.showD) {
					this.bval = this.cval;
					this.cval = this.dval;
					this.dval = '';
					this.showD = false;

				} else if (this.showC) {
					this.bval = this.cval;
					this.cval = '';
					this.showC = false;

				} else {
					this.bval = '';
					//this.showB = false;
				}
			},
			mvUpB(){
				var b = this.bval;
				this.bval = this.aval;
				this.aval = b;
			},
			mvDownB(){
				if(this.showC) {
					var b = this.bval;
					this.bval = this.cval;
					this.cval = b;					
				}
			},


			cAddNewOpt(){
				if(this.showE) {
					return;
				} else {
					if (this.showD) {
						this.showE = true;
						this.eval = this.dval;
						this.dval = '';

					} else {
						this.dval = '';
						this.showD = true;
					}
				}
			},
			delC(){
				if(this.showE) {
					this.cval = this.dval;
					this.dval = this.eval;
					this.eval = '';
					this.showE = false;

				} else if (this.showD) {
					this.cval = this.dval;
					this.dval = '';
					this.showD = false;

				} else {
					this.cval = '';
					this.showC = false;
				}
			},
			mvUpC(){
				var c = this.cval;
				this.cval = this.bval;
				this.bval = c;
			},
			mvDownC(){
				if (this.showD){
					var c = this.cval;
					this.cval = this.dval;
					this.dval = c;					
				}
			},


			dAddNewOpt(){
				if(this.showE) {
					return;
				} else {
					this.showE = true;
					this.eval = '';
				}
			},

			delD(){
				if (this.showE) {
					this.dval = this.eval;
					this.eval = '';
					this.showE = false;
				} else {
					this.dval = '';
					this.showD = false;
				}
			},
			mvUpD(){
				var d = this.dval;
				this.dval = this.cval;
				this.cval = d;
			},
			mvDownD(){
				if (this.showE) {
					var d = this.dval;
					this.dval = this.eval;
					this.eval = d;					
				}
			},


			delE(){
				this.eval = '';
				this.showE = false;
			},
			mvUpE(){
				var e = this.eval;
				this.eval = this.dval;
				this.dval = e;
			},

			addCreate(){
				var api = global_.question_create;
				var ans;
				if (this.type == 1) {
					ans = this.answer;

				} else if (this.type == 2) {
					ans = this.getAnswers(this.answers);
				}

				let data = {
					exam_id: this.exam_id,
					type: this.type,
					question: this.question,
					answer: ans,
					option_a: this.aval,
					option_b: this.bval,
					display: 0,
					analysis: this.analyze
				}

				if(this.cval) {
					data.option_c = this.cval;
				}

				if(this.dval) {
					data.option_d = this.dval;
				}
				
				if(this.eval) {
					data.option_e = this.eval;
				}

				//console.log(data);

				this.$http.post(api, data).then((resp)=>{
					//console.log(resp);
					layer.alert('试题创建成功', {title:'提示', area:['280px','190px']});
					this.$store.commit('sign', this.mod_name);
					this.$store.commit('incRowNumAfter', 1);
					this.$router.go(-1);

				}, (err)=>{
					layer.alert('试题创建失败', {title:'提示', area:['280px','190px']});
					console.log(err);
				});
			},

			goBack(){
				this.$router.go(-1);
			}
		},
		mounted(){
			//get exam_id from prev page
			this.exam_id = this.$store.state.exam_id;
			//console.log(this.exam_id);
		}
	}
</script>

<style type="text/css" scoped>

.analysis {
	margin: 20px;
	position: relative;
	left: 32px;
}

.btn-group {
	position: relative;
	left: -410px;
	top: -60px;
}

.iconfont {
	cursor: pointer;
}

.opts {
	position: absolute;
	left: 140px;
	width: 800px;
	margin-bottom: 30px;
	text-align: right;
}

.checkbox {
	height: 18px;
}

.answers {
	height: 40px;
	background: #f7f7f7;
}

.ansopt {
	display: inline-block;
	margin-right: 325px;
	margin-top: 8px;
	margin-left: 10px;
}

.adddel {
	display: inline-block;
	margin-right: 20px;
}
.rightopt {
	display: inline-block;
	margin-right: 20px;
}
.mvupdown {
	display: inline-block;
}

input .questionbody{
	width: 300px;
	height: 30px;
	border: 1px solid #d7d7d7;
}

div>.schoice input {
	width: 18px;
	height: 18px;
}

div>.mchoice input {
	width: 18px;
	height: 19px;
}

.schoice {
	display: inline-block;
}

.mchoice {
	display: inline-block;
	margin-left: 40px;
}

#tp {
	display: inline-block;
}

#ques {
	vertical-align: top;
	display: inline-block;
}

#quesbody {
	display: inline-block;
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