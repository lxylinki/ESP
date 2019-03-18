<template>
	<div class="nav">
      	<li  class="asideMenu" v-for="(item, index) in menuList" v-show="item.userGroup.includes(curGroup)">
			<div class="oneMenu" v-on:click="showToggle(item, index)">
                <a class="oneMenuText" v-on:click.self.prevent='showPage(item.url)'>
                	<img class="start-icon" :src=item.icon_highlight v-show="item.highlight">
                	<img class="start-icon" :src=item.icon v-show="!item.highlight">
                	{{item.name}}
                </a> 

            	<div class="navbtn" v-if="item.subItems.length>0">
            		<i class="iconfont">&#xe601;</i>
				</div>
			</div>	

			<transition name="sub-items">
				<Nav v-if="item.subItems.length>0 && item.isSubShow"
					 v-bind:menuList='item.subItems'
					 v-bind:curGroup='curGroup'>	 	
				</Nav>
			</transition>
      	</li>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'Nav',
		props:['menuList','curGroup'],

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

		    prepClickBehav(){
				$('.oneMenu').off('click').click(function(){
					$(this).addClass("highlight").parent().siblings().find('.oneMenu').removeClass("highlight");
					$(this).find('.oneMenuText').addClass('focused');
					$(this).parent().siblings().find('.oneMenuText').removeClass('focused');

					let navbtn = $(this).find('.navbtn');
					if(navbtn.hasClass('clicked')) {
						navbtn.first().removeClass('clicked').addClass('unclicked');

					} else {
						navbtn.removeClass('unclicked').addClass('clicked');
					}
				});
		    }
		},

		mounted(){
			this.prepClickBehav();
		}
	}
</script>

<style type="text/css" scoped>
* {
	font-family: STXihei, "Microsoft YaHei";
	font-size: 16px;
}

.clicked {
	transform: rotate(-180deg);
}

.unclicked {
	transform: rotate(-360deg);
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
	transition: all 1s ease 0s;
}

.iconfont {
	text-align: right;
}

.oneMenu:hover .oneMenuText:not(.focused){
	color: #a1a1a1;
}
.oneMenuText {
	display: inline-block; 
	width: 100%;
	height: 100%;
	margin-top: 10px;	
}


.sub-items-enter-active, .sub-items-leave-active {
 	/*transition: max-height 3s ease;*/
	transition: all .5s;
	-moz-transition: all .5s; 
	-webkit-transition: all .5s; 
	-o-transition: all .5s; 
}

.sub-items-enter, .sub-items-leave-to {
	max-height: 0;
}

.sub-items-enter-to, .sub-items-leave {
	max-height: 180px;
}
</style>