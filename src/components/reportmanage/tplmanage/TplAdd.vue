<template>
	<div id="tpladd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<span>模板管理</span>
		</div>	
		
		<div class="tpl-name-group">
			<div class="tpl-name-label">模板名称</div>
			<input class="tpl-name longinput" type="text" placeholder="必填">
		</div>


		<div class="tpl-note-group">
			<div class="tpl-note-label">模板备注</div>
			<textarea class="tpl-note"></textarea>
		</div>

		<div class="tpl-score-group">
			<div class="tpl-score-label">模板分数</div>
			<input class="tpl-score" type="text">
		</div>

		<div class="tpl-up-group">
			<div class="tpl-up-label">模板上传</div>
			<input class="real-upload-btn" type="file" id="upload-file" v-on:change="upFile($event)">		
			<el-button class="addbtn upload-btn">上传文件</el-button>
			<div class="tpl-upload-fig"></div>
		</div>

		<div class="btn-group">
			<el-button class="confirm" v-on:click="">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
		</div>

	</div>
</template>

<script type="text/javascript">
	export default {
		methods:{
			goBack(){
				this.$router.go(-1);
			},
		    decorFileInp(){
				var upbtn = document.querySelector(".upload-btn"),
				    upfile = document.querySelector("#upload-file");
				 
				upbtn.addEventListener("click", function(e) {
					if (upfile) {
						upfile.click();
					}
					// prevent navigation to "#"
					e.preventDefault();
					}, false
				);
		    }
		},

		mounted(){
			this.decorFileInp();
		}
	}
</script>

<style type="text/css" scoped>
.tpl-name {
	box-sizing: border-box;
	width:500px;
	height:36px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,1);
	border-radius:4px;
}

.tpl-name-label, .tpl-note-label, .tpl-score-label, .tpl-up-label {
	margin-left: 30px;
	margin-right: 30px;
}

.tpl-name-label, .tpl-name, .tpl-note-label, .tpl-note, .tpl-score-label, .tpl-score, .tpl-up-label, .tpl-up {
	display: inline-block;
}

.tpl-note {
	box-sizing: border-box;
	padding: 15px;
	width:500px;
	height:100px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,1);
	border-radius:4px;	
	vertical-align: top;
}
.tpl-name-group {
	margin-top: 30px;
}
.tpl-name-group, .tpl-note-group, .tpl-score-group, .tpl-up-group {
	margin-bottom: 30px;
}

.tpl-score {
	width:50px;
	height:28px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(153,153,153,1);
	border-radius:2px;
	text-align: center;
}

#upload-file {
	display: none;
}
.tpl-upload-fig {
	width:500px;
	height:118px;
	background:rgba(241,241,241,1);
	border-radius:4px;
	margin-left:130px;
	margin-top: 30px;
}

.btn-group {
	margin-left: 130px;
}
</style>