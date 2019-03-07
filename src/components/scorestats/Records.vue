<template>
	<div id="records">
		<div style="font-weight: bold; font-size: 14px;">五次成绩记录</div><br>

		<div id="idxbtns">

			<!--<div style="position: absolute; width: 100%; height: 25px; border-bottom:1px solid #d7d7d7;"></div>-->

			<!--<div class="btnsline"></div>-->
			<div class="idxdiv" v-show="buttons[0]">
				<div class="idxbtn btn1" 
					 v-on:click="setCurrent(0)" v-html="labels[0]">
				</div>
				<div v-bind:class="{ selected: selectOne, unselected: !selectOne }"></div>		
			</div>

			
			<div class="idxdiv" v-show="buttons[1]">
				<div class="idxbtn btn2"
					 v-on:click="setCurrent(1)" v-html="labels[1]">
				</div>
				<div v-bind:class="{ selected: selectTwo, unselected: !selectTwo }"></div>
			</div>

			<div class="idxdiv" v-show="buttons[2]">
				<div class="idxbtn btn3"
					 v-on:click="setCurrent(2)" v-html="labels[2]">
				</div>
				<div v-bind:class="{ selected: selectThree, unselected: !selectThree }"></div>
			</div>

			<div class="idxdiv" v-show="buttons[3]">
				<div class="idxbtn btn4"
					 v-on:click="setCurrent(3)" v-html="labels[3]">
				</div>
				<div v-bind:class="{ selected: selectFour, unselected: !selectFour }"></div>
			</div>

			<div class="idxdiv" v-show="buttons[4]">
				<div class="idxbtn btn5"
					 v-on:click="setCurrent(4)" v-html="labels[4]">
				</div>
				<div v-bind:class="{ iselected: selectFive, unselected: !selectFive }"></div>
			</div>				
	
		</div>
		<div style="height: 30px;"></div>
		<div>
			<div id="endtimetitle">完成时间:</div> 
			<div id="endtime">
				{{convEndTime(Number(current_record.created_at) + Number(current_record.time))}}
			</div>

			<el-button v-if="isTeacher"  class="clearbtn" type="text" @click="deleteAll()">
		      	<i class="iconfont">&#xe603; </i> 清除记录
		    </el-button>

		</div>

		<br>

		<div class="scoreheader">
			<div class="togglesigndiv" v-on:click="toggle()">
				<i class="iconfont togglesign" v-show="!showToggle">&#xe607;</i>
			</div>
			<div class="togglesigndiv" v-on:click="toggle()">
				<i class="iconfont togglesign" v-show="showToggle">&#xe608;</i>
			</div>
			<div class="scoretitle">得分统计</div><br>
		</div>

		<div class="scorefig" v-show="showToggle">
			<el-container>
  				<el-aside width="">
					<el-progress class="progress-circle" 
								 :width="110"
								 type="circle" 
								 :percentage="Number(current_record.exam_score / current_record.total_exam_score * 100)"
								 status="text" 
								 :stroke-width="9"
								 color="#333333">{{current_record.exam_score}}</el-progress>
					<div class="innerText" style="text-align: center;">最终得分</div>	

  				</el-aside>
  				<el-main style="background: transparent;"> 

  					<div style="width: 400px; text-align: right;">
	  					<div>
		  					<div style="display: inline-block; 
		  								margin-right: 10px;"
		  						 class="innerText">测试题</div>
							<el-progress class="progress-bar" :text-inside="true" :stroke-width="18" 
										:percentage="Number(current_record.opertation_score / current_record.total_score * 100)" 
										color="#333333"></el-progress>  	
							<div style="display: inline-block; margin-right: 10px;"><span class="innerText">{{current_record.opertation_score}}分 （总{{current_record.total_score}}分)</span></div>					
	  					</div>

	  					<div>
							<div style="display: inline-block; margin-right: 10px;"
							     class="innerText">抢救治疗</div>
							<el-progress class="progress-bar" :text-inside="true" :stroke-width="18" 
										:percentage="Number(current_record.rescue_score / current_record.total_rescue_score * 100)" 
										color="#333333"></el-progress>	
							<div style="display: inline-block; margin-right: 10px;"><span class="innerText">{{current_record.rescue_score}}分 （总{{current_record.total_rescue_score}}分)</span></div>		  						
	  					</div>  						
  					</div>

  				</el-main>
			</el-container>
		</div>

		<div style="height: 20px;"></div>
		
		<div class="scoreheader">
			<div class="togglesigndiv" v-on:click="second_toggle()">
				<i class="iconfont togglesign" v-show="!showSecondToggle">&#xe607;</i>
			</div>
			<div class="togglesigndiv" v-on:click="second_toggle()">
				<i class="iconfont togglesign" v-show="showSecondToggle">&#xe608;</i>
			</div>
			<div class="scoretitle">答题统计</div><br>
		</div>

		<div class="scorefig"  v-show="showSecondToggle">
			<!--<ul style="margin: 0;">-->
				<li class="scorefigli" v-for="item in exam_records"  v-on:click="showDetails(item)">
					<div class="ulitem itemname">{{item.name}}</div> 
					<div class="ulitem itemscore">得<span>{{item.score}}</span>分</div>
					<div class="ulitem">|</div>
					<div class="ulitem itemright">对<span style="color: #4fcc66;">{{item.right_count}}</span>题</div> 
					<div class="ulitem">|</div>
					<div class="ulitem itemerror">错<span style="color: red;">{{item.error_count}}</span>题</div> 
					<!--<el-button class="op ulitem inspectdetail" type="text">-->
		      		<div class="ulitem inspect">查看明细 <i class="iconfont" style="color: #0099ff;"> &#xe628;</i></div>
		      		<!--</el-button>-->
				</li>
			<!--</ul>-->

		</div>
	

		<div style="height: 20px;"></div>

		<div class="scoreheader">
			<div class="togglesigndiv" v-on:click="third_toggle()">
				<i class="iconfont togglesign" v-show="!showThirdToggle">&#xe607;</i>
			</div>
			<div class="togglesigndiv" v-on:click="third_toggle()">
				<i class="iconfont togglesign" v-show="showThirdToggle">&#xe608;</i>
			</div>
			<div class="scoretitle">答题明细: <span>{{exam_name}}</span></div><br>
		</div>

		<div class="scorefig" v-show="showThirdToggle">
			<Details v-for="(detail, idx) in detail_list" 
				 v-bind:key="detail.id"
				 v-bind:idx="idx"
			     v-bind:detail="detail"
			     style="font-size: 14px;"></Details>
		</div>
	
	</div>
</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	import Details from './Details.vue';

	export default {
		props: ['records', 
				'exam_records', 
				'class_id', 
				'expr_id', 
				'user_id', 
				'isTeacher'],

		components: {
			Details: Details
		},

		data(){
			return {
				buttons: [false, false, false, false, false],
				labels:['', '', '', '', ''],
				current_record: this.records[0],
				showToggle: true,
				showSecondToggle: true,
				showThirdToggle: true,
				detail_list:[],
				exam_name:'',

				selectOne: false,
				selectTwo: false,
				selectThree: false,
				selectFour: false,
				selectFive: false,
			}
		},

		methods:{
			setCurrent(idx) {
				this.current_record = this.records[idx];
				switch(idx+1) {
					case 1:
						this.selectOne = true;
						this.selectTwo = false;
						this.selectThree = false;
						this.selectFour = false;
						this.selectFive = false;
						break;
					case 2:
						this.selectOne = false;
						this.selectTwo = true;
						this.selectThree = false;
						this.selectFour = false;
						this.selectFive = false;
						break;
					case 3:
						this.selectOne = false;
						this.selectTwo = false;
						this.selectThree = true;
						this.selectFour = false;
						this.selectFive = false;
						break;
					case 4:
						this.selectOne = false;
						this.selectTwo = false;
						this.selectThree = false;
						this.selectFour = true;
						this.selectFive = false;
						break;
					case 5:
						this.selectOne = false;
						this.selectTwo = false;
						this.selectThree = false;
						this.selectFour = false;
						this.selectFive = true;
						break;					
				}
			},

			add0(m){
				return m<10?'0'+m:m 
			},

			convEndTime(ntime) {
				var unixTime = new Date(ntime * 1000);
				var commonTime = this.add0(unixTime.getHours()) + ':'
							   + this.add0(unixTime.getMinutes()) + ':'
							   + this.add0(unixTime.getSeconds());

				return commonTime;
			},

			initButtons(){
				this.buttons = [false, false, false, false, false];
				for(var i=0; i<this.records.length; i++) {
					this.buttons[i] = true;
					this.labels[i] = Utils.convTime.call(this, Number(this.records[i].created_at));
				}
			},

			toggle(){
				this.showToggle = !this.showToggle;
			},

			second_toggle(){
				this.showSecondToggle = !this.showSecondToggle;
			},

			third_toggle(){
				this.showThirdToggle = !this.showThirdToggle;
			},

			showDetails(row) {
				/*
				$('li').click(function(){
					$(this).addClass("highlight").siblings().removeClass("highlight");
				});*/

				this.exam_name = row.name;
				let api = global_.exam_details;
				let data = {
					"record_id": row.record_id,
					//"exper_id": row.exper_id,
					"eid": row.exper_id,
					"exam_id": row.exam_id,
					"class_id": this.class_id
				}
				this.$http.post(api, data).then((resp)=>{
					this.detail_list = resp.body;
					
				}, (err)=>{
					layer.alert('请求考核明细失败',
						{title:'提示', area:['280px','190px']});
					console.log(err);
				});
			},

			//delete currrent record
			/*
			delCurrent(){
				//console.log(this.current_record);
				let api = global_.record_delete;
				let data = {
					"id": this.current_record.record_id
				}
				this.$http.post(api, data).then((resp)=>{
					var idx = this.records.indexOf(this.current_record);
					this.records.splice(idx, 1);
					alert('学习记录清除成功');

				}, (err)=>{
					alert('学习记录清除失败');
					console.log(err);
				});
			},*/

			deleteAll(){
				var _this = this;
				var sure = layer.confirm("确定清空学习记录？",
					{title:'提示', area:['280px','190px']},
					function(){_this.delAll()});				
			},

			//清空5次记录
			delAll(){
				let api = global_.record_delete;
				let data = {
					'exper_id': this.expr_id,
					'user_id': this.user_id,
					'class_id': this.class_id,
					"id": this.current_record.record_id
				}

				this.$http.post(api, data).then((resp)=>{
					//var idx = this.records.indexOf(this.current_record);
					//this.records.splice(idx, 1);
					//notify parent to refresh scorelist
					this.$emit('rmRecord');

					console.log(resp);
					layer.alert('学习记录清除成功',
					{title:'提示', area:['280px','190px']});

				}, (err)=>{
					layer.alert('学习记录清除失败',
					{title:'提示', area:['280px','190px']});
					console.log(err);
				});
			}

		},

		watch: {
			records(newVal, oldVal) {
				if(this.records.length>0) {
					this.initButtons();
					this.current_record = this.records[0];
				}
			},

			exam_records(newVal, oldVal) {
				// clean detail list
				if(this.exam_records.length == 0) {
					this.detail_list = [];
					this.exam_name = '';
				}
				this.setCurrent(0);
			},
		},

		mounted(){
			$(document).on('click', 'li.scorefigli', function(){
				$(this).addClass("highlight").siblings().removeClass("highlight");
			});

			if(this.records.length > 0) {
				//console.log(this.records);
				//default value
				this.current_record = this.records[0];
				this.selectOne = true;
				this.initButtons();
				
			} else {
				layer.alert('无记录', {title:'提示', area:['280px','190px']});
			}
		}
	}
</script>

<style type="text/css" scoped>

.scorefigli {
	cursor: pointer;
}

.highlight {
	background: #f7f8fc;
}

/*
.inspectdetail {
	line-height: 0.5rem;
	vertical-align: top;
}*/

.ulitem {
	display: inline-block;
	font-size: 14px;
}

.innerText {
	font-size: 14px;
}

.itemname {
	width: 40%;
	text-align: left;
	margin-left: 30px;
}

.itemscore, .itemright, .itemerror {
	width: 50px;
	text-align: center;
}

.inspect {
	margin-left: 30px;
	text-align: center;
}

#idxbtns {
	/*display: -webkit-flex;*/
	display: flex;
	/*display: relative;*/
	font-size: 14px;
	text-align: center;
	width: 100%;
	overflow: hidden;
	border-bottom: 1px solid #d7d7d7;
}

.idxbtn {
	width: 103px;
	height: 46px;
	/*border-radius: 5px;
	background: #d7d7d7; 
	display: inline-block;
	border: 1px solid #d7d7d7;
	background: #f7f7f7;*/
	cursor: pointer;
	font-size: 12px;
	/*animation: myfirst 5s;*/
}

/*
@-webkit-keyframes myfirst {
	from {width: 100%;}
	to{width: 0}
}*/


.selected {
	width: 100%;
	height: 4px;
	background: #0099ff;
}

.unselected {
	margin: auto;
	width: 0px;
	height: 4px;
	background: #0099ff;
	
	/*
	transition:width .2s;
	-moz-transition:width .2s; 
	-webkit-transition:width .2s; 
	-o-transition:width .2s;*/ 

	transition:all .2s;
	-moz-transition:all .2s; 
	-webkit-transition:all .2s; 
	-o-transition:all .2s; 
}

.idxdiv:hover .unselected {
	width: 100%;
}


.idxdiv {
	width: 103px;
	height: 100%;
	text-align: center;
	margin-right: 50px;
	z-index: 1;
}

.idximg {
	color: #d7d7d7;
}

.idximgbg {
	color: #ffffff;
}

#endtime {
	display: inline-block;
	font-weight: bold;
}

#endtimetitle {
	display: inline-block;
	font-size: 16px;
	font-family: "Microsoft YaHei";
}

.togglesign {
	margin-left: 10px;
	margin-right: 10px;
	font-size: 12px;
	cursor: pointer;
}

.togglesigndiv{
	/*display: inline-block;*/
	line-height: 40px;
}

.scoretitle {
	/*display: inline-block;*/
	font-size: 16px;
	font-family: "Microsoft YaHei";
}

.scoreheader {
	display: flex;
	align-items: center;
	background: #f7f7f7; 
	width: 100%; 
	height: 30px;
}

.scorefig {
	background: #ffffff; 
	width: 100%; 
	height: 100%;
}

.progress-circle {
	margin: 20px;
}

.progress-bar {
  margin-top: 30px;
  width: 40%;
  display: inline-block;
}

/*
.btnsline {
	position: absolute;
	top: 344px; 
	height: 1px;
	width: 100%; 
	background: #d7d7d7; 
	overflow: hidden;
}*/

/*
.btnsdiv {
	display: flex;
	width: 100%;
	position: relative;
	border-bottom: 1px solid #d7d7d7;
}*/
.clearbtn {
	margin-left: 30px;
}
/*
 @media screen and (min-width: 1500px) {
     #records {
        overflow-x:hidden;
    }
}

 @media screen and (min-height: 1200px) {
     #records {
        overflow-y:hidden;
    }
}*/

</style>
