<template>
	<div class="nav">
		<ul class="asideMenu">
          	<li v-for="(item,index) in menuList" v-show="item.userGroup.includes(curGroup)">
				<div class="oneMenu" v-on:click="showToggle(item, index)">

	                <a class="oneMenuText" 
	                   style="display: inline-block; 
	                   		  width: 160px;" 
	                   v-bind:href='item.url'
	                   v-on:click.self.prevent='showPage(item.url)'>

	                	<img class="start-icon" :src=item.icon_highlight v-show="false">
	                	<img class="start-icon" :src=item.icon v-show="true"><span>{{item.name}}</span>

	                </a> 

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
						
			}
		},
		methods:{
	      showToggle(item, idx){
	        item.isSubShow = !item.isSubShow;
	        //close others
	        for(let i in this.menuList) {
	        	if(i != idx) {
	        		this.menuList[i].isSubShow = false;
	        	}
	        }
	      },

	      showPage(url){
	      	this.$router.push(url);
	      },
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

.start-icon {
	display: inline-block;
	vertical-align: middle;
	margin: 10px;
}

.asideMenu {
    margin: 0;
    padding: 0;
    width: 230px;
    background: #ffffff;
    height: 100%;
    overflow: hidden;
}

.highlight {
	background: #5c9cec;
}

.oneMenu {
	text-align: left;
	line-height: 30px;
	/*border-top: 1px solid rgba(161, 161, 161, 0.5);*/
}

/*outmost main menu*/
.oneMenu:hover .oneMenuText{
	color: #ffffff !important;
}

/*only the last in main menu has bottom border*/
/*
li:last-child .oneMenu{
	border-bottom: 1px solid rgba(161, 161, 161, 0.5);
}*/

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

/*
li a:before {
	font-family: "iconfont";
	content: '\e62b';
}*/

.navbtn {
	float: right;
	margin-right: 20px;
	margin-top: 120px;
	cursor: pointer;
}

.iconfont {
	color: #ffffff;
	text-align: right;
}

</style>