<template>
	<div class="nav">
		<ul class="asideMenu">
          	<li v-for="(item,index) in menuList" v-show="item.userGroup.includes(curGroup)">
				<div class="oneMenu" v-on:click="showToggle(item, index)">

	                <a class="oneMenuText" 
	                   style="display: inline-block; 
	                   		  width: 100%;
	                   		  height: 100%;
	                   		  margin-top: 10px;"
	                   v-on:click.self.prevent='showPage(item.url)'>
	                	<img class="start-icon" :src=item.icon_highlight v-show="item.highlight">
	                	<img class="start-icon" :src=item.icon v-show="!item.highlight">{{item.name}}
	                </a> 

                	<div class="navbtn"
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
	      	item.highlight = true;
	        item.isSubShow = !item.isSubShow;
	        //close others
	        for(let i in this.menuList) {
	        	if(i != idx) {
	        		this.menuList[i].isSubShow = false;
	        		this.menuList[i].highlight = false;
	        	}
	        }
	      },

	      showPage(url){
	      	this.$router.push(url);
	      },
		},

		mounted(){
			$(document).on('click', '.oneMenu', function(){
	      		$(this).addClass("highlight").parent().siblings().find('.oneMenu').removeClass("highlight");
	      		$(this).find('.oneMenuText').addClass('focused');
	      		$(this).parent().siblings().find('.oneMenuText').removeClass('focused');   
	      	});


			//main menu highlight
			//$(document).on('click', '.oneMenu', function(){
	      		//$(this).addClass("highlight").parent().siblings().find('.oneMenu').removeClass("highlight");      		
	      		//$(this).find('a').first().css("color", "white");
	      		//$(this).parent().siblings().find('.oneMenu').find('a').css("color", "black");
	      		
	      		//clear other sub-highlights
	      		//$(this).siblings().find('.oneMenu').removeClass('subhighlight');
	      		//$(this).siblings().find('.oneMenu').find('.oneMenuText').removeClass('subtext-highlight');
	      	//});

			//submenu text color
			/*
	      	$(document).on('click','.asideMenu .asideMenu .oneMenu .oneMenuText', function(){
	      		$(this).addClass('subtext-highlight').parent().parent().siblings().find('a').removeClass('subtext-highlight');
	      	});

	      	//submenu background color
	      	$(document).on('click','.asideMenu .asideMenu .oneMenu', function(){
	      		$(this).addClass('subhighlight').parent().siblings().find('.oneMenu').removeClass('subhighlight');
	      	});*/
		}
	}
</script>

<style type="text/css" scoped>
* {
	font-family: STXihei, "Microsoft YaHei";
	font-size: 16px;
}

.start-icon {
	display: inline-block;
	vertical-align: middle;
	margin-right: 18px;
	margin-left: 30px;
	margin-top: 10px;
	margin-bottom: 10px;
}

.asideMenu {
    margin: 0;
    padding: 0;
    width: 230px;
    height: 100%;
    background: #ffffff;
    height: 100%;
    overflow: hidden;
}

.highlight {
	background: #5c9cec;
	color: white;
}

.oneMenu{
	/*border: 1px solid red;*/
	height: 45px;
	width: 100%;
	display: flex;
	align-items: center;
	cursor: pointer;
	text-align: left;
	/*border-top: 1px solid rgba(161, 161, 161, 0.5);*/
}

/*subitems style*/
.asideMenu .asideMenu .oneMenu {
	box-sizing: border-box;
	text-align: left;
	border-top: none;
	border-bottom: none;
	border-right: none;
	padding-top: 5px;
	padding-left: 15px;
}

.navbtn {
	float: right;
	cursor: pointer;
	margin-right: 10px;
}

.iconfont {
	text-align: right;
}

.oneMenu:hover .oneMenuText:not(.focused){
	color: #a1a1a1;
}

/*outmost main menu*/
/*
.oneMenu:hover .oneMenuText{
	color: #a1a1a1 !important;
}*/

/*only the last in main menu has bottom border*/
/*
li:last-child .oneMenu{
	border-bottom: 1px solid rgba(161, 161, 161, 0.5);
}*/

/*
.oneMenuText {
	font-family: STXihei, "Microsoft YaHei";
	font-size: 16px;
}*/


/*
.asideMenu .asideMenu .oneMenu:hover {
	border-left: 4px solid #1890ff;
	color: #1890ff;
}

.asideMenu .asideMenu .oneMenu .oneMenuText {
	text-align: left;
	margin-left: 20px;
	color: black;
}

.asideMenu .asideMenu .oneMenu .oneMenuText:hover {
	color: #1890ff !important;
}*/

/*
.subtext-highlight {
	color: #1890ff !important;
}

.subhighlight {
	background: #e6f7ff !important;
	border-left: 4px solid #6ab0ff;
}*/

/*
li a:link, li a:hover, li a:active, li a:visited {
	color: red;
    display: block;
    padding: 8px 16px;
}*/

/*
li a:before {
	font-family: "iconfont";
	content: '\e62b';
}*/

</style>