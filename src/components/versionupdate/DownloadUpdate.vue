<template>
	<div id="downloadupdate">
		<div id="img">
			<div style="text-align: center; line-height: 200px;">图片</div>
		</div>
		<el-button id="downloadbtn" v-on:click="getNewVer(0)">立即下载</el-button>

		<div id="detailcontents">
			<p class="bold">ESP2.0</p>
			<p class="bold">更新内容：</p>
			<p>1. 全新UI界面改善<br>
			2. 版本性能提升， 解决100人同时在线卡顿的问题<br>
			3. 显示部分内容</p>
			<p class="bold">版本序号：</p>
			<p>ESP2.0.8</p>
			<p class="bold">文件大小：</p>
			<p>2G</p>
			<p class="bold">创建时间：</p>
			<p>2018年12月12日</p>			
		</div>
	</div>
</template>

<script type="text/javascript">
	import global_ from '../Global.js';
	export default {
		data(){
			return {

			}
		},
		methods: {
			getNewVer(tpl){
				var api = global_.download_url;				
				this.$http.get(api).then((resp)=>{
					console.log(resp);

				}, (err)=>{
					alert('请求下载失败');
					console.log(err);
				});
			}
		}
	}
</script>

<style type="text/css">

#downloadupdate {
	text-align: center;
}

#img {
	width: 400px; 
	height: 200px; 
	background: #c9c9c9;
	margin: auto;
}

#downloadbtn {
	background: #31313c;
	color: #ffffff;
	border-color: #31313c;
	margin: 20px;
}

#detailcontents {
	margin: auto;
	width: 400px;
	height: 100%;
	text-align: left;
}
</style>