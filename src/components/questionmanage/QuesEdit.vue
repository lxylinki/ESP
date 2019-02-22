<template>
	<div id="quesadd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			试题管理
		</div>
		
		<div style="height: 30px;"></div>

		<div class="questype">
			<div id="tp">
				题型： 
			</div>

			<div class="schoice">
				<input type="radio" id="single" name="qtype" value='1' v-model="type">
				<label for="single">单选</label>
			</div>
			
			<div class="mchoice">
				<input type="radio" id="multi" name="qtype" value='2' v-model="type">
				<label for="multi">多选</label>
			</div>
		</div>

		<div style="height: 40px;"></div>

		<div class="expbelong">所属实验： 
			<template>
			  <el-select class="longselect exp-belong-input"
			  			 v-model="exp_value" 
			  			 placeholder="请搜索实验名称"
			  			 v-on:change="">
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
			<div class="opts-div">
<!------------------------------------------------------------------------------------------------------------------------>
			<div class="answera" v-show="showA">
				<div style="display: inline-block; margin-left: 0px; margin-right: 20px;">选项A</div>

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
				<div class="checkicon" style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox"
						   id="aCheck"
						   v-on:change="checkA()" 
						   type="checkbox"
						   v-model="aCorrect"><label for="aCheck"></label>
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
				<div style="display: inline-block; margin-left: 0px; margin-right: 20px;">选项B</div>

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
				<div class="checkicon" style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox" 
						   type="checkbox"
						   id="bCheck"
						   v-on:change="checkB()"
						   v-model="bCorrect"><label for="bCheck"></label>
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
				<div style="display: inline-block; margin-left: 0px; margin-right: 20px;">选项C</div>

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
				<div class="checkicon" style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox" 
						   type="checkbox"
						   id="cCheck"
						   v-on:change="checkC()"
						   v-model="cCorrect"><label for="cCheck"></label>
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
				<div style="display: inline-block; margin-left: 0px; margin-right: 20px;">选项D</div>

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
				<div class="checkicon" style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox" 
						   type="checkbox"
						   id="dCheck" 
						   v-on:change="checkD()"
						   v-model="dCorrect"><label for="dCheck"></label>
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
				<div style="display: inline-block; margin-left: 0px; margin-right: 20px;">选项E</div>
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
				<div class="checkicon" style="display: inline-block;">
					<input style="height: 24px; width: 24px; margin-right: 20px; margin-left: 30px;" 
						   class="checkbox" 
						   type="checkbox"
						   id="eCheck"
						   v-on:change="checkE()"
						   v-model="eCorrect"><label for="eCheck"></label>
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
			<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
			<div style="height: 40px;"></div>
		</div>

		</div>

	
	</div>

</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	import store from '../../vuex/store.js';
	import Utils from '@/components/Utils.js';

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
				analyze:'',

				exp_options:[],
				exp_value: '',
				id: ''
			}
		},

		methods: {
			/*
			rmanswer( answers, ans){
				var idx = answers.indexOf(ans);
				answers.splice(idx, 1);
				//console.log(this.answers);				
			},

			getAnswers(answers){
				return answers.reduce((a, b)=> a+b);
			},*/

			checkA(){
				//when single choice and A is checked
				var opta = document.querySelector('#aCheck');

				if(!this.aval && opta.checked) {
					this.aCorrect = false;
					Utils.lalert('请输入选项');
					return;
				}

				if(opta.checked && this.type == 1){
					//this.answer = 'a';
					this.aCorrect = true;
					this.bCorrect = false;
					this.cCorrect = false;
					this.dCorrect = false;
					this.eCorrect = false;
					
					//when multi-choice and A is checked
				} else if(opta.checked && this.type == 2){
					//this.answers.push('a');
					this.aCorrect = true;

					//when multi-choice and A is unchecked
				} else {
					//this.rmanswer(this.answers, 'a');
					this.aCorrect = false;
				}

			},
			checkB(){
				var optb = document.querySelector('#bCheck');

				if(!this.bval && optb.checked) {
					this.bCorrect = false;
					Utils.lalert('请输入选项');
					return;
				}

				if(optb.checked && this.type == 1){
					//this.answer = 'b';
					this.bCorrect = true;
					this.aCorrect = false;
					this.cCorrect = false;
					this.dCorrect = false;
					this.eCorrect = false;

				} else if(optb.checked && this.type == 2) {
					//this.answers.push('b');
					this.bCorrect = true;

				} else {
					//this.rmanswer(this.answers, 'b');
					this.bCorrect = false;
				}
			},
			checkC(){
				var optc = document.querySelector('#cCheck');

				if(!this.cval && optc.checked) {
					this.cCorrect = false;
					Utils.lalert('请输入选项');
					return;
				}

				if(optc.checked && this.type == 1) {
					//this.answer = 'c';
					this.cCorrect = true;
					this.aCorrect = false;
					this.bCorrect = false;
					this.dCorrect = false;
					this.eCorrect = false;

				} else if(optc.checked && this.type == 2) {
					//this.answers.push('c');
					this.cCorrect = true;

				} else {
					//this.rmanswer(this.answers, 'c');
					this.cCorrect = false;
				}
			},
			checkD(){
				var optd = document.querySelector('#dCheck');

				if(!this.dval && optd.checked) {
					this.dCorrect = false;
					Utils.lalert('请输入选项');
					return;
				}

				if(optd.checked && this.type == 1) {
					//this.answer = 'd';
					this.dCorrect = true;
					this.aCorrect = false;
					this.bCorrect = false;
					this.cCorrect = false;
					this.eCorrect = false;

				}else if(optd.checked && this.type == 2) {
					//this.answers.push('d');
					this.dCorrect = true;

				}else {
					//this.rmanswer(this.answers, 'd');
					this.dCorrect = false;
				}	
			},
			checkE(){
				var opte = document.querySelector('#eCheck');
				if(!this.eval && opte.checked) {
					this.eCorrect = false;
					Utils.lalert('请输入选项');
					return;
				}
				if(opte.checked && this.type == 1) {
					//this.answer = 'e';
					this.eCorrect = true;
					this.aCorrect = false;
					this.bCorrect = false;
					this.cCorrect = false;
					this.dCorrect = false;

				} else if (opte.checked && this.type == 2) {
					//this.answers.push('e');
					this.eCorrect = true;

				} else {
					//this.rmanswer(this.answers, 'e');
					this.eCorrect = false;
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

					let ifB = this.bCorrect;
					this.bCorrect = this.aCorrect;
					this.aCorrect = ifB;			
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

				let ifB = this.bCorrect;
				this.bCorrect = this.aCorrect;
				this.aCorrect = ifB;
			},

			mvDownB(){
				//if option C is present
				if(this.showC) {
					var b = this.bval;
					this.bval = this.cval;
					this.cval = b;

					let ifB = this.bCorrect;
					this.bCorrect = this.cCorrect;
					this.cCorrect = ifB;					
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

				let ifC = this.cCorrect;
				this.cCorrect = this.bCorrect;
				this.bCorrect = ifC;
			},
			mvDownC(){
				if (this.showD){
					var c = this.cval;
					this.cval = this.dval;
					this.dval = c;	

					let ifC = this.cCorrect;
					this.cCorrect = this.dCorrect;
					this.dCorrect = ifC;									
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

				let ifD = this.dCorrect;
				this.dCorrect = this.cCorrect;
				this.cCorrect = ifD;
			},
			mvDownD(){
				if (this.showE) {
					var d = this.dval;
					this.dval = this.eval;
					this.eval = d;	

					let ifD = this.dCorrect;
					this.dCorrect = this.eCorrect;
					this.eCorrect = ifD;				
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

				let ifE = this.eCorrect;
				this.eCorrect = this.dCorrect;
				this.dCorrect = ifE;
			},

			composeFinalAns(){
				this.answer = '';
				let final_ans = {'A':this.aCorrect, 'B':this.bCorrect, 'C':this.cCorrect, 'D':this.dCorrect, 'E':this.eCorrect};
				for(let opt in final_ans) {
					if(final_ans[opt]) {
						this.answer += opt;
					}
				}
				//console.log(this.answer);
			},

			preCheck(){
				if(!this.exp_value) {
					Utils.lalert('请选择所属实验');
					return;

				} else if(!this.question) {
					Utils.lalert('请输入题干');
					return;

				} else if((!this.aval) || (!this.bval)) {
					Utils.lalert('请输入选项');
					return;

				} else if(!(this.aCorrect || this.bCorrect || this.cCorrect || this.dCorrect || this.eCorrect)) {
					Utils.lalert('请选择正确选项');
					return;
				} else {
					this.composeFinalAns();
					this.saveEdit();
				}
			},			

			saveEdit(){
				var api = global_.ques_update;
				var ans;
				if (this.type == 1) {
					ans = this.answer;

				} else if (this.type == 2) {
					ans = this.getAnswers(this.answers);
				}

				let data = {
					id: this.id,
					eid: this.exp_value,
					type: this.type,
					question: this.question,
					answer: this.answer,
					option_a: this.aval,
					option_b: this.bval,
					//display: 0,
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
					layer.alert('试题编辑成功', {title:'提示', area:['280px','190px']});
					this.$router.go(-1);

				}, (err)=>{
					layer.alert('试题编辑失败', {title:'提示', area:['280px','190px']});
					console.log(err);
				});
			},

			goBack(){
				this.$router.go(-1);
			},

			fillExpSelect(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this);
					this.exp_options = resp.body._list;
					this.exp_options.unshift({'name': '所有实验', 'id': null});
				}				
			}
		},
		mounted(){	
			Utils.page_check_status.call(this);		
			var edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {
				this.fillExpSelect();
				var row = this.$store.state.row;
				//console.log(row);
				this.id = row.id;
				this.type = row.type;
				this.exp_value = row.eid;
				this.question = row.question;
				this.aval = row.option_a;
				this.bval = row.option_b;
				
				if(row.option_c) {
					this.cval = row.option_c;
					this.showC = true;
				}
				if(row.option_d) {
					this.dval = row.option_d;
					this.showD = true;
				}

				if(row.option_e) {
					this.eval = row.option_e;
					this.showE = true;
				}

				this.answer = row.answer;
				//this.given_answer = row.answer;
				//console.log(row.answer);
				/*
				if(row.type == 1) {
					this.answer = row.answer;

				} else if(row.type == 2){
					this.answers = row.answer.split('');
				}*/
				//console.log(this.given_answer);
				if(row.answer.indexOf('A') != -1) {
					this.aCorrect = true;
					//document.querySelector('#aCheck').checked = true;
				}
				if(row.answer.indexOf('B') != -1) {
					this.bCorrect = true;
					//document.querySelector('#bCheck').checked = true;
				}
				if(row.answer.indexOf('C') != -1) {
					this.cCorrect = true;
					//document.querySelector('#cCheck').checked = true;
				}
				if(row.answer.indexOf('D') != -1) {
					this.dCorrect = true;
					//document.querySelector('#dCheck').checked = true;
				}
				if(row.answer.indexOf('E') != -1) {
					this.eCorrect = true;
					//document.querySelector('#eCheck').checked = true;
				}
				this.analyze = row.analysis;
			}
		}
	}
</script>

<style type="text/css" scoped>
.checkicon {
	position: relative;
}

.checkicon input[type="checkbox"] {
	opacity: 0;
}

.checkicon label {
	width: 22px;
	height: 22px;
	border: 2px solid #cccccc;
	position: absolute;
	left: 30px;
	top: 4px;
}

.checkicon input[type="checkbox"]:checked + label {
	background: #0099ff;
	border: 1px solid #0099ff;
	background-image: url("../../assets/white-correct.png");
	background-repeat: no-repeat;
}

.longselect /deep/ .el-input__inner {
	height: 34px;
	width: 300px;
}

.redalert {
	color: red;
}
.whitedefault {
	/*same with bg color*/
	color: #ffffff;
}

.analysis {
	margin-top: 15px;
	margin-right: 15px;
	position: relative;
}

.analysisbody {
	margin-left: 5px;
}

.btn-group {
	position: relative;
	margin-left: 95px;
}

.iconfont {
	cursor: pointer;
}

.opts {
	background: #ffffff;
	position: relative;
	width: 800px;
	margin-bottom: 30px;
	text-align: left;
}

.checkbox {
	height: 18px;
}

.answers {
	position: relative;
	height: 40px;
	background: #f7f7f7;
}

.ansopt {
	display: inline-block;
	margin-right: 320px;
	margin-top: 8px;
	margin-left: 20px;
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
	margin-left: 38px;
	margin-right: 5px;
}

#ques {
	position: relative;
	vertical-align: top;
	display: inline-block;
	margin-left: 36px;
}

#anls {
	margin-left: 5px;
}

#quesbody {
	display: inline-block;
	position: relative;
	left: 0px;
}

.expbelong {
	margin-left: 5px;
}

.questionbody {
	margin-left: 10px;
}

.exp-belong-input {
	margin-left: 10px;
}

.opts-div {
	text-align: right;
	width: 650px;
	padding-left: 5px;
}

</style>