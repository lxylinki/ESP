<template>
	<div id="newpager">

	    <div>
	      <div class="page"  v-show="show">

	        <div class="pagelist">

	          <div class="jump pageturner" :class="{disabled:pstart}" @click="goToPrevPage()">上一页</div>

	          <div class="jump" @click="jumpPage(1)" :class="{bgprimary:current_page==1}">1</div>
	          
	          <div class="ellipsis"  v-show="efront">...</div>

	          <div class="jump" v-for="num in indexs" :class="{bgprimary:current_page==num, ends:num==1 || num==pages}" @click="jumpPage(num)">{{num}}</div>

	          <div class="ellipsis"  v-show="ebehind">...</div>
	          <!--Duplicate when only 1 page-->
	          <div v-show="pages>1" class="jump" @click="jumpPage(pages)" :class="{bgprimary:current_page==pages}">{{pages}}</div>

	          <div :class="{disabled:pend}" class="jump pageturner" @click="goToNextPage()">下一页</div>

	          <!--
	          <div class="jumppointleft">第</div>
	          
						<div class="jumpinp"><input type="text" v-model="changePage" v-on:keydown="invokeJump($event, changePage)"></div>
	          
						<div class="jumppointright">页</div>

	          <div class="jump gobtn" @click="jumpPage(changePage)">跳转</div>
	      	  -->

	        </div>
	      </div>
	    </div>

	</div>
</template>


<script type="text/javascript">
	export default {
		props:['current_page', 'pages'],
		data(){
			return {
				changePage:'1',
			}
		},

		methods: {
			goToPrevPage(){
				if(this.current_page-1>0) {
					this.$emit( 'setPage', this.current_page-1);
				}
			},

			goToNextPage(){
				if(this.current_page+1<=this.pages){
					this.$emit( 'setPage', this.current_page+1);
				}
			},

			invokeJump(e, idx){
				if(e.keyCode == 13) {
					this.jumpPage(idx);
				}
			},

			jumpPage(idx){
				this.$emit('setPage', idx);
			}
		},

		computed: {
			//至少有一页
			show: function(){
				return this.pages && this.pages >= 1;
			},

			//已是第一页
	        pstart: function() {
	           	return this.current_page == 1;
	        },
	        
	        //已是最后一页
	        pend: function() {
	            return this.current_page == this.pages;
	        },

	        efront: function() {
	           if (this.pages <= 7) return false;
	           return this.current_page > 5
	        },
	        
	        ebehind: function() {
	           if (this.pages <= 7) return false;
	           var nowAy = this.indexs;
	           return nowAy[nowAy.length - 1] != this.pages;
	        },
	        
	        indexs: function() {
	           	var left = 2,
	             	right = this.pages-1,
	             	ar = [];

	           	if (this.pages >= 7) {
	             	if (this.current_page > 5 && this.current_page < this.pages - 4) {
		               	left = Number(this.current_page) - 3;
		               	right = Number(this.current_page) + 3;

	            } else {
	                if (this.current_page <= 5) {
	                 	left = 1;
	                 	right = 7;

	               } else {
	                 	right = this.pages;
	                 	left = this.pages - 6;
	               }
	             }
	           }
	           while (left <= right) {
	             ar.push(left);
	             left++;
	           }
	           return ar;
	        },

		}
	}
</script>

<style type="text/css" scoped>
    .page {
      font-weight: 900;
      height: 40px;
      text-align: center;
      color: #888;
      margin: 20px auto 0;
    }

    .pagelist {
      font-size: 0;
      background: #fff;
      height: 50px;
      line-height: 50px;
    }

    .pagelist div {
      font-size: 14px;
      display: inline-block;
    }

    .pagelist .jump {
    	display: inline-block;
    	height: 38px;
		border: 1px solid #d7d7d7;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;
		cursor: pointer;
		margin-left: 5px;
		line-height: 40px;
    }

    .pagelist .pageturner {
    	width: 86px;
    }

    .pagelist .jump:not(.pageturner) {
    	width: 38px;
    }

    .pagelist .bgprimary {
      cursor: default;
      color: #fff;
      background: #5a98de;
      border-color: #5a98de;
    }

    /*hide original 1st and last page*/
    .jump.bgprimary.ends {
    	display: none;
    }

    .jumpinp input {
      width: 25px;
      height: 25px;
      font-size: 13px;
      border: 1px solid #ccc;
      text-align: center;
    }

    .ellipsis {
      padding: 0px 8px;
    }

    .jumppointleft {
      margin-left: 30px;
      margin-right: 10px;
    }

    .jumppointright {
    	margin-left: 10px;
    }

    .pagelist .gobtn {
      font-size: 13px;
      margin-left: 10px;
    }

    .pagelist .jump.disabled{
      color: #d7d7d7;
      cursor: auto;
    }
</style>