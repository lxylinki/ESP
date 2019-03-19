<template>
	<div id="quesedit">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			公共题库管理
		</div>

		<div class="ques-type">
			<div class="ques-type-title">题型:</div>
			<div class="schoice">
				<input type="radio" id="single" name="qtype" value='1' v-model="type">
				<label for="single">单选</label>
			</div>
			<div class="mchoice">
				<input type="radio" id="multi" name="qtype" value='2' v-model="type">
				<label for="multi">多选</label>
			</div>
		</div>


		<div class="exp-belong">所属实验： 
			<template>
			  <el-select class="longselect exp-belong-input"
			  			 v-model="exp_value" 
			  			 placeholder="请搜索实验名称">
			    <el-option
			      v-for="item in exp_options"
			      :key="item.id"
			      :label="item.name"
			      :value="item.eid">
			    </el-option>
			  </el-select>
			</template>			
			<span v-bind:class="{red: !exp_value, white: exp_value}">*</span>
		</div>

		
		<div class="question">
			<div class="ques-body-title">题干：</div>
				
			<div class="ques-body">
				<el-input type="textarea"
						  class="ques-body-input"
						  v-model="question"
						  placeholder="必填"></el-input>
			</div>
		</div>


		<div class="opts">
			<div class="ans-header">
				<div class="ans-opt-col">答案选项</div>
				<div class="add-del-col">增加/删除</div>
				<div class="right-opt-col">正确选项</div>
				<div class="mv-updown-col">上移下移</div>
			</div>
		
			<div class="opts-div">
<!------------------------------------------------------------------------------------------------------------------------>
				<div class="answer-a ans-opt">
					<div class="opt-label">选项A</div>
					<!--input-->
					<div class="opt-input">
						<input class="longinput" type="text" v-model="options[0]" placeholder="必填">
					</div>				
					<!--add-->
					<div class="opt-add-del">
						<i class="iconfont opt-add" v-bind:class="{black: opts_num < 5, white: opts_num === 5}">&#xe62d;</i>
						<i class="iconfont opt-del" v-bind:class="{black: opts_num > 2, white: opts_num === 2}">&#xe6a9;</i>
					</div>
					
					<!--correct one-->
					<div class="checkicon opt-correct">
						<input type="checkbox" v-model="choices[0]" class="checkbox" id="aCheck"><label for="aCheck"></label>
					</div>
					
					<!--move up-->
					<div class="opt-up-down">
						<i class="iconfont opt-up">&#xe7c6;</i>
						<i class="iconfont opt-down">&#xe8ed;</i>
					</div>
				</div>
<!----------------------------------------------------------------------------------------------------------------------->
				<div class="answer-b ans-opt">
					<div class="opt-label">选项B</div>
					<!--input-->
					<div class="opt-input">
						<input class="longinput" type="text" v-model="options[1]" placeholder="必填">
					</div>				
					<!--add-->
					<div class="opt-add-del">
						<i class="iconfont opt-add" v-bind:class="{black: opts_num < 5, white: opts_num === 5}">&#xe62d;</i>
						<i class="iconfont opt-del" v-bind:class="{black: opts_num > 2, white: opts_num === 2}">&#xe6a9;</i>
					</div>
					
					<!--correct one-->
					<div class="checkicon opt-correct">
						<input type="checkbox" v-model="choices[1]" class="checkbox" id="bCheck"><label for="bCheck"></label>
					</div>
					
					<!--move up-->
					<div class="opt-up-down">
						<i class="iconfont opt-up">&#xe7c6;</i>
						<i class="iconfont opt-down">&#xe8ed;</i>
					</div>
				</div>

<!-------------------------------------------------------------------------------------------------------------------------->
				<div class="answer-c ans-opt">
					<div class="opt-label">选项C</div>
					<!--input-->
					<div class="opt-input">
						<input class="longinput" type="text" v-model="options[2]">
					</div>				
					<!--add-->
					<div class="opt-add-del">
						<i class="iconfont opt-add" v-bind:class="{black: opts_num < 5, white: opts_num === 5}">&#xe62d;</i>
						<i class="iconfont opt-del" v-bind:class="{black: opts_num > 2, white: opts_num === 2}">&#xe6a9;</i>
					</div>
					
					<!--correct one-->
					<div class="checkicon opt-correct">
						<input type="checkbox" v-model="choices[2]" class="checkbox" id="cCheck"><label for="cCheck"></label>
					</div>
					
					<!--move up-->
					<div class="opt-up-down">
						<i class="iconfont opt-up">&#xe7c6;</i>
						<i class="iconfont opt-down">&#xe8ed;</i>
					</div>
				</div>	
<!-------------------------------------------------------------------------------------------------------------------------->
				<div class="answer-d ans-opt">
					<div class="opt-label">选项D</div>
					<!--input-->
					<div class="opt-input">
						<input class="longinput" type="text" v-model="options[3]">
					</div>				
					<!--add-->
					<div class="opt-add-del">
						<i class="iconfont opt-add" v-bind:class="{black: opts_num < 5, white: opts_num === 5}">&#xe62d;</i>
						<i class="iconfont opt-del" v-bind:class="{black: opts_num > 2, white: opts_num === 2}">&#xe6a9;</i>
					</div>
					
					<!--correct one-->
					<div class="checkicon opt-correct">
						<input type="checkbox" v-model="choices[3]" class="checkbox" id="dCheck"><label for="dCheck"></label>
					</div>
					
					<!--move up-->
					<div class="opt-up-down">
						<i class="iconfont opt-up">&#xe7c6;</i>
						<i class="iconfont opt-down">&#xe8ed;</i>
					</div>
				</div>	
<!----------------------------------------------------------------------------------------------------------------------------->
				<div class="answer-e ans-opt">
					<div class="opt-label">选项E</div>
					<!--input-->
					<div class="opt-input">
						<input class="longinput" type="text" v-model="options[4]">
					</div>				
					<!--add-->
					<div class="opt-add-del">
						<i class="iconfont opt-add" v-bind:class="{black: opts_num < 5, white: opts_num === 5}">&#xe62d;</i>
						<i class="iconfont opt-del" v-bind:class="{black: opts_num > 2, white: opts_num === 2}">&#xe6a9;</i>
					</div>
					
					<!--correct one-->
					<div class="checkicon opt-correct">
						<input type="checkbox" v-model="choices[4]" class="checkbox" id="eCheck"><label for="eCheck"></label>
					</div>
					
					<!--move up-->
					<div class="opt-up-down">
						<i class="iconfont opt-up">&#xe7c6;</i>
						<i class="iconfont opt-down">&#xe8ed;</i>
					</div>
				</div>	
<!----------------------------------------------------------------------------------------------------------------------->
			</div><!--end opts-div-->
		</div><!--end opts-->
			

		<div class="anls">
			<div class="anls-title">题目解析：</div>	
			<div class="anls-body">
				<el-input type="textarea" class="anals-body-input" v-model="analyze"></el-input>
			</div>
		</div>
		
				
		<div class="btn-group">
			<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
		</div>


	</div>

</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	import Utils from '@/components/Utils.js';

	export default {
		data(){
			return{
				mod_name: 'ques-manage',	
				options: [null, null, null, null, null],
				choices: [false, false, false, false, false],

				//1 单选 2 多选
				type:'',
				question:'',
				exam_id:'',
				answer:'',
				analyze:'',

				exp_options:[],
				exp_value: '',
				answer: '',
				opts_num: 0
			}
		},
		
		methods: {
			goBack(){
				this.$router.go(-1);
			},

			fillExpSelect(profile) {
				asyncReq.call(this);
				async function asyncReq(){	
					let resp = await Utils.reqExpList.call(this, null, profile.body.group);
					this.exp_options = resp.body._list;
					this.exp_options.unshift({'name': '所有实验', 'id': null});
				}				
			},

			rows_num(){
            	let	$show = $(".opts-div").find('.ans-opt:visible');
            	return $show.length;
			},		

			prepAdd(){
				let _this = this;
				$('.opt-add').on('click', function(e){
                    let $this = $(this),
                        $option = [],
                        $parent = $this.parents(".ans-opt"),
                        $list = $this.parents(".opts-div"),
                        $li = $list.find(".ans-opt"),
                        $show = $list.find(".ans-opt:visible"),
                        $hide = $list.find(".ans-opt:hidden"),
                        index = $li.index($parent[0]),
                        oldTextName = "",
                        newTextName = "",
                        len = 0;

                    if ($show.length >= 5) {
                        layer.msg("最多5个答案选项");
                        return false;
                    }

                    $parent.after($hide.eq(0));
                    len = $show.length + 1;
                    $hide.eq(0).show();
                    oldTextName = $hide.eq(0).find(".opt-label").text();
                    $li = $list.find(".ans-opt");

					for (var i = len - 1; i > index; i--) {
					    newTextName = $li.eq(i).find(".opt-label").text();
					    $li.eq(i).find(".opt-label").text(oldTextName);
					    oldTextName = newTextName;
					}	
					_this.opts_num = _this.rows_num();				
				});
			},

			prepDel(){
				let _this = this;
				$('.opt-del').on('click', function(e){
                   	let $this = $(this),
                        $option = [],
                        $parent = $this.parents(".ans-opt"),
                        $list = $this.parents(".opts-div"),
                        $li = $list.find(".ans-opt"),
                        $show = $list.find(".ans-opt:visible"),
                        $hide = $list.find(".ans-opt:hidden"),
                        index = $li.index($parent[0]),
                        oldTextName = "",
                        newTextName = "",
                        len = 0;

                    if ($show.length <= 2) {
                        layer.msg("最少2个答案选项");
                        return false;
                    }

                    $show.eq($show.length - 1).after($parent);
                    len = $show.length;

                    //内外都清空数据
                    $parent.find('.checkbox').prop('checked', false);
                    $parent.find('.opt-input').find('input').val('');
                    _this.options[index] = null;
                    _this.choices[index] = false;
                    
                    $parent.hide();
                    oldTextName = $parent.find(".opt-label").text();
                    $li = $list.find(".ans-opt");

                    for (var i = index; i < len; i++) {
                        newTextName = $li.eq(i).find(".opt-label").text();
                        $li.eq(i).find(".opt-label").text(oldTextName);
                        oldTextName = newTextName;
                    }	
                    _this.opts_num = _this.rows_num();					
				});
			},

			prepUp(){
				$('.opt-up').on('click', function(e){
                	let $this = $(this),
                        $parent = $this.parents(".ans-opt"),
                        $li = $parent.parents(".opts-div").find(".ans-opt"),
                        liMarginTop = parseInt($li.css("marginTop"), 10),
                        liMarginBottom = parseInt($li.css("paddingBottom"), 10),
                        index = $li.index($parent[0]),
                        $prev = {},
                        currName = $parent.find(".opt-label").text(),
                        prevName = "";

                    if (index <= 0) {
                        return false;
                    }

                    $prev = $li.eq(index - 1);                    
                    $prev.css("marginTop", ($parent.height() + liMarginTop) + "px");

                    
                    $parent.stop().animate({
                        "top": "-" + (liMarginBottom + $prev.height() + liMarginTop + $parent.height()) + "px"
                    }, 400, function () {
                        $parent.css("top", "0px");
                        $prev.css("marginTop", liMarginTop + "px");
                        prevName = $prev.find(".opt-label").text();
                        $prev.before($parent);
                        $prev.find(".opt-label").text(currName);
                        $parent.find(".opt-label").text(prevName);
                    });
				});
			},

			prepDown(){
				$('.opt-down').on('click', function(e){
                    let $this = $(this),
                        $parent = $this.parents(".ans-opt"),
                        $li = $parent.parents(".opts-div").find(".ans-opt"),
                        liMarginBottom = parseInt($li.css("marginBottom"), 10),
                        index = $li.index($parent[0]),
                        $next = {},
                        currName = $parent.find(".opt-label").text(),
                        nextName = "";

                    if (index >= $li.length - 1) {
                        return false;
                    }
                    $next = $li.eq(index + 1);
                    $next.css("marginBottom", ($parent.height() + liMarginBottom) + "px");
                    $parent.stop().animate({
                        "top": liMarginBottom + $next.height() + liMarginBottom + $parent.height() + "px"
                    }, 400, function () {
                        $parent.css("top", "0px");
                        $next.css("marginBottom", liMarginBottom + "px");

                        nextName = $next.find(".opt-label").text();
                        $next.after($parent);
                        $next.find(".opt-label").text(currName);
                        $parent.find(".opt-label").text(nextName);
                    });					
				});
			},

			prepCorrect(){
				let _this = this;
				$('.checkbox').on('click', function(e){
					let $this = $(this),
						$parent = $this.parents(".ans-opt"),
						$li = $parent.parents(".opts-div").find(".ans-opt"),
						index = $li.index($parent[0]),
						currName = $parent.find(".opt-label").text(),
						ans = currName.split('').pop(),
						id = ans.toLowerCase() + 'Check';

					let opt = document.querySelector('#'+id);

					//must enter option
					if(!_this.options[index]) {
						_this.choices[index] = false;
						opt.checked = false;							
						Utils.lalert('请输入选项');
						return;								
					}

					//only one can be selected
					if(opt.checked && _this.type == 1){
						for(let i in _this.choices) {
							if(i == index) {
								_this.choices[i] = true;
							} else {
								_this.choices[i] = false;
							}
						}
						_this.answer = ans;

					} else if (opt.checked && _this.type == 2) {
						_this.choices[index] = true;
						if(_this.answer.indexOf(ans) == -1) {
							_this.answer += ans;
						}	

					} else {
						_this.choices[index] = false;
						_this.answer = _this.answer.replace(ans, '');
					}
				});
			},

			preCheck(){
				if(!this.exp_value) {
					Utils.lalert('请选择所属实验');
					return;

				} else if(!this.question) {
					Utils.lalert('请输入题干');
					return;

				} else if((!this.options[0]) || (!this.options[1])) {
					Utils.lalert('请输入选项');
					return;

				} else if(!(this.choices[0] || this.choices[1] || this.choices[2] || this.choices[3] || this.choices[4])) {
					Utils.lalert('请选择正确选项');
					return;
				} else {
					this.saveEdit();
				}
			},

			saveEdit(){
				let api = global_.ques_update,
				    ans = this.answer,
					data = {
					id: this.id,
					eid: this.exp_value,
					type: this.type,
					question: this.question,
					answer: this.answer,
					option_a: this.options[0],
					option_b: this.options[1],
					analysis: this.analyze
				}

				if(this.options[2]) {
					data.option_c = this.options[2];
				}

				if(this.options[3]) {
					data.option_d = this.options[3];
				}
				
				if(this.options[4]) {
					data.option_e = this.options[4];
				}

				this.$http.post(api, data).then((resp)=>{
					//console.log(resp);
					Utils.lalert('试题编辑成功');
					this.$router.go(-1);

				}, (err)=>{
					Utils.err_process.call(this, err, '试题编辑失败');
				});
			},

		},

		mounted(){		
			Utils.page_check_status.call(this).then(resp=>{
				this.fillExpSelect(resp);
			});	

			let edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {			
				this.type = 1;
				this.prepDel();
				this.prepAdd();
				this.prepUp();
				this.prepDown();
				this.prepCorrect();
				this.opts_num = this.rows_num();

				let row = this.$store.state.row;
				this.id = row.id;
				this.type = row.type;
				this.exp_value = row.eid;
				this.question = row.question;
				this.options[0] = row.option_a;
				this.options[1] = row.option_b;
				
				if(row.option_c) {
					this.options[2] = row.option_c;
				}

				if(row.option_d) {
					this.options[3] = row.option_d;
				}

				if(row.option_e) {
					this.options[4] = row.option_e;
				}

				this.answer = row.answer;

				if(row.answer.indexOf('A') != -1) {
					this.choices[0] = true;
				}
				if(row.answer.indexOf('B') != -1) {
					this.choices[1] = true;
				}
				if(row.answer.indexOf('C') != -1) {
					this.choices[2] = true;
				}
				if(row.answer.indexOf('D') != -1) {
					this.choices[3] = true;
				}
				if(row.answer.indexOf('E') != -1) {
					this.choices[4] = true;
				}
				this.analyze = row.analysis;
			}
		}
	}
</script>

<style type="text/css" scoped>
.ques-type {
	margin-top: 30px;
	margin-bottom: 40px;
}

.ques-type-title {
	display: inline-block;
	margin-left: 38px;
	margin-right: 20px;
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

.exp-belong {
	margin-left: 5px;
	margin-bottom: 30px;
}

.exp-belong-input {
	margin-left: 10px;
}

.red {
	color: red;
}

.white {
	/*same with bg color*/
	color: white;
	pointer-events: none;
}
.ques-body-title {
	position: relative;
	vertical-align: top;
	display: inline-block;
	margin-left: 36px;	
}

.ques-body {
	display: inline-block;
	position: relative;
	left: 0px;	
}

.ques-body-input {
	margin-left: 10px;
}

.longselect /deep/ .el-input__inner {
	height: 36px;
	width: 300px;
}

.ans-header {
	position: relative;
	height: 40px;
	width: 100%;
	background: #f0f7ff;
}


.ans-opt-col {
	display: inline-block;
	margin-right: 640px;
	margin-top: 8px;
	margin-left: 10px;
}

.add-del-col {
	display: inline-block;
	margin-right: 10px;
}

.right-opt-col {
	display: inline-block;
	margin-right: 10px;
}

.mv-updown-col {
	display: inline-block;
}

.opts {
	border: 1px solid red;
	width:1000px;
	height: 100%;
	border:1px solid rgba(92,156,236,1);
	border-radius:0px 0px 4px 4px;
	margin-left: 98px;
	margin-bottom: 30px;
	margin-top: 30px;
}

.opts-div {
	position: relative;
	width: 1000px;
	text-align: right;
	width: 100%;
	padding-bottom: 20px;
}

.opt-add, .opt-del {
	font-size: 140%;  
}

.black {
	color: #333333; 
}

.opt-up, .opt-down {
	color: #333333;
	font-size: 160%;
}

.opt-label {
	 display: inline-block; 
	 margin-right: 20px;
}

.opt-correct {
	height: 24px; 
	width: 24px; 
	margin-right: 20px; 
	margin-left: 30px;
}

.iconfont {
	cursor: pointer;
}

input:not(.checkbox) {
	width:600px;
	height:36px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,0.5);
	border-radius:4px;
}

.checkicon {
	position: relative;
}

.checkicon input[type="checkbox"] {
	opacity: 0;
}

.checkicon label {
	width: 20px;
	height: 20px;
	border: 2px solid #cccccc;
	position: absolute;
	left: 0px;
	top: 0px;
}

.checkicon input[type="checkbox"]:checked + label {
	/*
	background: #0099ff;
	border: 1px solid #0099ff;*/
	background: #5c9cec;
	border: 1px solid #5c9cec;
	background-image: url("../../assets/white-correct.png");
	background-repeat: no-repeat;
}

.opt-label {
	 display: inline-block; 
	 margin-right: 20px;
}

.opt-input {
	display: inline-block; 
	margin-right: 30px;
}

.opt-add-del, .opt-correct, .opt-up-down {
	display: inline-block;
}

.checkicon {
	width: 0px;
	height: 0px;
}

.opt-up {
	margin-left: 30px;
}

.opt-down {
	margin-right: 60px;
}

.anls {
	margin-top: 15px;
	margin-right: 15px;
	position: relative;
}


.btn-group {
	position: relative;
	margin-left: 95px;
	margin-bottom: 40px;
}

.opt-correct {
	position: relative;
	top: 15px;
}

.ans-opt {
	/*must set position for animation*/
	position: relative;
	height: 60px;
	line-height: 60px;
}

.anls-title {
	margin-left: 10px;
	display: inline-block;
	vertical-align: top;
}

.anls-body {
	display: inline-block;
	margin-left: 2px;
	margin-bottom: 40px;
}


.longinput {
	box-sizing: border-box;
}
</style>