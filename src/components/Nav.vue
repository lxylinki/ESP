<template>
	<div class="nav">
		<ul class="asideMenu">
          	<li v-for="(item,index) in menuList" v-show="contains(curGroup, item.userGroup)">
				<div class="oneMenu" v-on:click="showToggle(item)">

	                <a class="oneMenuText" 
	                   style="display: inline-block; 
	                   		  width: 160px;" 
	                   v-bind:href='item.url'
	                   v-on:click.self.prevent='showPage(item.url)'>{{item.name}}</a> 

                	<div class="navbtn" 
                		   style="display: inline-block; 
                		          position: relative;
                		          margin-right: 20px;
                		          margin-top: 8px;"
                		   v-if="item.subItems.length>0">
                		<i v-show="!item.isSubShow" class="iconfont">&#xe601;</i>
                		<i v-show="item.isSubShow" class="iconfont">&#xe600;</i>
					</div>
				</div>

				<Nav v-if="item.subItems.length>0 && item.isSubShow" 
					 v-bind:menuList='item.subItems'
					 v-bind:curGroup='curGroup'>	 	
				</Nav>

          	</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'Nav',
		props:['menuList','curGroup'],

		data(){
			return {
				len:this.menuList.length			
			}
		},
		methods:{
	      showToggle:function(item){
	        item.isSubShow = !item.isSubShow;
	      },

	      showPage(url){
	      	this.$router.push(url);
	      },

	      contains(item, arr) {
	      	for(var i=0; i<arr.length; i++) {
	      		if(item == arr[i]) {
	      			return true;
	      		}
	      	}
	      	return false;
	      }
		},

		mounted(){
			//main menu highlight
			$(document).on('click', 'li', function(){
	      		$(this).addClass("highlight").siblings().removeClass("highlight");
	      		$(this).find('a').first().css("color", "white");
	      		$(this).siblings().find('a').css("color", "#a1a1a1");
	      		
	      		//clear other sub-highlights
	      		$(this).siblings().find('.oneMenu').removeClass('subhighlight');
	      		$(this).siblings().find('.oneMenu').find('.oneMenuText').removeClass('subtext-highlight');
	      	});

			//submenu text color
	      	$(document).on('click','.asideMenu .asideMenu .oneMenu .oneMenuText', function(){
	      		$(this).addClass('subtext-highlight').parent().parent().siblings().find('a').removeClass('subtext-highlight');
	      	});

	      	//submenu background color
	      	$(document).on('click','.asideMenu .asideMenu .oneMenu', function(){
	      		$(this).addClass('subhighlight').parent().siblings().find('.oneMenu').removeClass('subhighlight');
	      	});
		}
	}
</script>

<style type="text/css" scoped>

* {
	font-family: STXihei;
	font-size: 16px;
}

.asideMenu {
    margin: 0;
    padding: 0;
    width: 240px;
    background: #31313c;
    height: 100%;
    overflow: hidden;
}

.oneMenu {
	text-align: left;
	line-height: 45px;
	border-top: 1px solid rgba(161, 161, 161, 0.5);
}

/*outmost main menu*/
.oneMenu:hover .oneMenuText{
	color: #ffffff !important;
}

/*only the last in main menu has bottom border*/
li:last-child .oneMenu{
	border-bottom: 1px solid rgba(161, 161, 161, 0.5);
}

.oneMenuText {
	font-family: STXihei, "Microsoft YaHei";
	font-size: 16px;
}

/*subitems style*/
.asideMenu .asideMenu .oneMenu {
	text-align: left;
	line-height: 30px;
	background: #31313c;
	border-top: none;
	border-bottom: none;
	border-right: none;
}

.asideMenu .asideMenu .oneMenu:hover {
	border-left: 4px solid #6ab0ff;
}

.asideMenu .asideMenu .oneMenu .oneMenuText {
	text-align: left;
	margin-left: 20px;
}

.asideMenu .asideMenu .oneMenu .oneMenuText:hover {
	/*color: #6ab0ff !important;*/
	color: white !important;
}

.subtext-highlight {
	/*color: #6ab0ff !important;*/
	color: white !important;
}

.subhighlight {
	background: #20222d !important;
	border-left: 4px solid #6ab0ff;
}

li a:link, li a:hover, li a:active, li a:visited {
	color: #a1a1a1;
    display: block;
    padding: 8px 16px;
}

.navbtn {
	float: right;
	margin-right: 20px;
	margin-top: 120px;
	cursor: pointer;
}

.iconfont {
	color: #a1a1a1;
	text-align: right;
}

</style>