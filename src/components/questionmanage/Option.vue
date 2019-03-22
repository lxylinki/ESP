<template>
	<div id="option">
		<div class="ans-opt" v-show="opt.show">
			<div class="opt-label">{{opt.name}}</div>

			<div class="opt-input">
				<input class="longinput" type="text" v-model="opt.text">
			</div>				

			<div class="opt-add-del">
				<i class="iconfont opt-add" v-on:click="add()" v-bind:class="{black: opts_num < 5, white: opts_num >= 5}">&#xe62d;</i>
				<i class="iconfont opt-del" v-on:click="del()" v-bind:class="{black: opts_num > 2, white: opts_num <= 2}">&#xe6a9;</i>
			</div>
			
			<div class="checkicon opt-correct">
				<i class="iconfont unchecked-box" v-show="!opt.correct" v-on:click="select()">&#xe63c;</i>
			    <i class="iconfont checked-box" v-show="opt.correct" v-on:click="unselect()">&#xe63e;</i>
			</div>
			
			<div class="opt-up-down">
				<i class="iconfont opt-up" v-on:click="mvUp()">&#xe7c6;</i>
				<i class="iconfont opt-down" v-on:click="mvDown()">&#xe8ed;</i>
			</div>
		</div>		
	</div>
</template>

<script type="text/javascript">
	export default {
		props:['opt', 'opts_num', 'idx'],
		methods: {
			del(){
				this.$emit('delete', this.opt);
			},

			add(){
				this.$emit('add', this.idx);
			},

			select(){
				this.$emit('select', this.idx);
			},

			unselect(){
				this.$emit('unselect', this.opt);
			},

			mvUp(){
				this.$emit('mvup', this.idx);
			},

			mvDown(){
				this.$emit('mvdown', this.idx);
			}
		}
	}
</script>

<style type="text/css" scoped>
.ans-opt {
	/*must set position for animation*/
	position: relative;
	height: 60px;
	line-height: 60px;
	right: 40px;
}

.opt-add, .opt-del {
	font-size: 140%;  
}

.black {
	color: #333333; 
}

.white {
	color: white;
	pointer-events: none;
}

.opt-up, .opt-down {
	color: #333333;
	font-size: 160%;
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

.opt-correct {
	height: 24px; 
	width: 24px;
	margin-left: 30px;
}

.opt-up-down {
	margin-left: 10px;
}

.iconfont {
	cursor: pointer;
}

.opt-input input {
	width:600px;
	height:32px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,0.5);
	border-radius:4px;
}

.opt-label {
	 display: inline-block; 
	 margin-right: 20px;
}

.opt-correct {
	height: 24px; 
	width: 24px; 
	margin-right: 30px; 
	margin-left: 40px;
}

.unchecked-box, .checked-box {
	color: #5c9cec;
	cursor: pointer;
	font-size: 180%;
}
</style>