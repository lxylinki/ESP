<template>
	<div id='expadd'>
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold;font-size: 20px;">|</span> 
			<span class="pagetitle">实验管理</span>
		</div>

		<div style="height: 30px;"></div>
		<div>
			实验名称：<input class="longinput" type="text" v-model="expname">
			<span class="redalert" v-show="!expname">*</span>
			<span class="whitedefault"v-show="expname">*</span>
		</div>

		<div style="height: 30px;"></div>

		<div class='box'>
			<input type="file" id="uploadfile" v-on:change="upFile($event)">
			
			<!--<label for='uploadfile' style="cursor: pointer;"></label>-->

			实验图片：<el-button class="uploadbtn">上传图片</el-button>
			<br>
			<div style="height: 30px"></div>
			<img src="" id='image'>
		</div>

		<div style="height: 30px;"></div>

		<div>
			<span style="vertical-align: top">实验概述 :</span>

			<el-input
			  class="inputarea"
			  type="textarea"
			  :rows="10"
			  placeholder="请输入内容"
			  v-model="note">
			</el-input>	

			<div style="height: 40px;"></div>

			<div class="btn-group">
				<el-button class="confirm" v-on:click="addCreate()">确定</el-button>
				<el-button class="goback" v-on:click="goBack()">返回</el-button>
			</div>		
		</div>


	</div>
</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	import store from '../../vuex/store.js';
	export default {
		data(){
			return {
				expname:'',
				note:'',
				ufile:'',
				mod_name: 'exp-manage'
			}
		},
		store: store,
		methods: {
			goBack(){
				this.$router.go(-1);
			},

			//upload image
			addCreate(){
				var api = global_.exp_create;

				var formData = new FormData();
		      	formData.append('name', this.expname);
		      	formData.append('note', this.note);
		      	formData.append('img', this.ufile);

				//console.log(formData);

				this.$http.post(api, formData).then((resp)=>{
					layer.alert('实验添加成功', {title:'提示', area:['280px','190px']});
					//console.log(resp);
					this.$store.commit('sign', this.mod_name);
					this.$store.commit('incRowNumAfter', 1);
					this.$router.go(-1);

				}, (err)=>{
					layer.alert('实验添加失败', {title:'提示', area:['280px','190px']});
					console.log(err);
				});
			},

			//image is still local
			upFile(event) {
		      	this.ufile = event.target.files[0];
		      	document.querySelector('#image').setAttribute('src', URL.createObjectURL(this.ufile));
		    }

		}
	}
</script>

<style type="text/css" scoped>
#image {
	width: 200px;
	position: relative;
	left: 80px;
}
	
.redalert {
	color: red;
}
.whitedefault {
	/*must be the same with bg color*/
	color: #f7f7f7;
}

.inputarea {
	width: 476px;
}

.btn-group {
	margin-left: 77px;
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


.uploadbtn, .uploadbtn:hover, .uploadbtn:active, .uploadbtn:focus {
	background: #5e5e5e;
  	color: white;
  	border-color: #5e5e5e;
}

/*
.box {
	position: relative;
}

 #uploadfile {
  	position: absolute;
  	left: -9999px;
  	opacity: 0;
  }

 label {
 	opacity: 1;
 	background: red;
  	position: absolute;
  	top: 0px;
  	left: 0px;
  	bottom: 0px;
  	right: 0px;
 }*/
 #uploadfile {
 	position: absolute;
 	left: 270px;
 	cursor: pointer;
 	opacity: 0;
 }

</style>