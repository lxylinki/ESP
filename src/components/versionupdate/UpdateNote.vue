<template>
	<div id="updatenote">
		<div style="width: 100%; height: 35px; border-bottom: 2px solid #eee">
			<span style="color: #1281b2; font-weight: bold; font-size: 20px;">|</span> 
			<span class="pagetitle">版本更新</span>
		</div>
		<div style="height: 40px;"></div>

		<div id="notes">
			<div><br><span class="bold">版本更新</span><br><span style="font-size: 14px;">插图</span></div>
			<div id="contentsdiv">
				<div id="contents">	
					<p class="bold">ESP2.0</p>
					<p class="bold">更新内容：</p>
					<p>1. 全新UI界面改善<br>
					2. 版本性能提升， 解决100人同时在线卡顿的问题<br>
					3. 显示部分内容</p>
					<p class="bold">版本序号： ESP2.0.8<br>
					文件大小：2G<br>
					创建时间：2018年12月12日</p>
				</div>
			</div>

			<div id="btnpanel">
				<el-button id="detailbtn" v-on:click="goDownload()">查看详情</el-button>
			</div>
		</div>		
	</div>
</template>

<script type="text/javascript">
	export default {
		data(){
			return{

			}
		},
		methods: {
			goDownload(){
				this.$router.push('/downloadupdate');
			}
		}
	}
</script>

<style type="text/css">

p {
	text-align: left;
	font-size: 14px;
}

.bold {
	font-weight: bold;
	font-size: 14px;
}

#notes {
	background: #c9c9c9; 
	width: 300px; 
	height: 400px; 
	border-radius: 10px;
	text-align: center;
}

#notes:hover #btnpanel{
	display: block;
}

#contentsdiv {
	background: #f7f7f7;
	width: 300px;
	height: 280px;
	position: absolute;
	top: 340px;
	-webkit-border-bottom-right-radius: 10px;
	-webkit-border-bottom-left-radius: 10px;
}

#contents {
	margin: 20px;
}

#btnpanel {
	width: 300px;
	height: 65px;
	background: #c9c9c9;
	position: absolute;
	-webkit-border-bottom-right-radius: 10px;
	-webkit-border-bottom-left-radius: 10px;
	position: absolute;
	top: 555px;
	display: none;
}



#detailbtn {
	margin: 16px;
	background: #6b6b6b;
	color: #ffffff;
	border-color: #6b6b6b;
}
</style>