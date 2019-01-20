<template>
	<div id="demo">
		<button v-on:click="show = !show">
			Toggle
		</button>

		<transition name="fade">
			<p v-if="show">hello</p>
		</transition>

		<div class="square">
			<div class="bluesquare"></div>
		</div>
		

		<p>请把鼠标指针移动到蓝色的 div 元素上，就可以看到过渡效果。</p>

		<p><b>注释：</b>本例在 Internet Explorer 中无效。</p>
	</div>
</template>

<script type="text/javascript">
	export default {
		data(){
			return {
				show: true
			}
		}
	}
</script>

<style type="text/css">
	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
	
	div.square {
		width:200px;
		height:200px;
		background:grey;		
	}

	div.bluesquare
	{
		margin:auto;
		width:100px;
		height:100px;
		background:blue;
		transition:width 2s;
		-moz-transition:width 2s; /* Firefox 4 */
		-webkit-transition:width 2s; /* Safari and Chrome */
		-o-transition:width 2s; /* Opera */
	}

	div.square:hover .bluesquare
	{
		width:300px;
	}
</style>