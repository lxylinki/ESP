<template>
	<div id="searchselect">
	    <div class="allitems">

	    	<div class="select-header select-header-normal">
		    	<input type="text" class="select-header-text" v-on:focus="showToggle=true" v-model="selected_item" readonly="readonly" placeholder="请选择"></input>
				<i class="iconfont togglesign" v-on:click="toggleList()" v-show="!showToggle">&#xe638;</i>
				<i class="iconfont togglesign" v-on:click="toggleList()" v-show="showToggle">&#xe637;</i>
				<div class="place-holder" v-show="showToggle"></div>
				<input type="text" class="select-sub-header" v-show="showToggle" v-model="item_search_state" placeholder="请搜索"></input>
	    	</div>


			<div class="select-list" v-show="showToggle">
				<div class="init-place-holder"></div>
				<li class="select-item" v-for="item in filtered_items" v-on:click="makeChoice(item)">
					<span v-if="item.hasOwnProperty('class_name')">{{item.class_name}}</span>
					<span v-if="item.hasOwnProperty('name')">{{item.name}}</span>
				</li>	
			</div>

	    </div>
	</div>
</template>

<script type="text/javascript">
	export default {
		props:['items'],
		data(){
			return {
				showToggle: false,
				item_search_state: '',
				selected_item: '',
				item_id: '',
				filtered_items: []
			}
		},

		methods: {
			toggleList(){
				this.showToggle = !this.showToggle;
			},

			makeChoice(item){
				if(item.hasOwnProperty('class_name')) {
					this.selected_item = item.class_name;

				} else if(item.hasOwnProperty('name')) {
					this.selected_item = item.name;
				}
				
				this.item_id = item.id;
				this.item_search_state = null;
				this.toggleList();
				this.$emit('makechoice', item.id);
			},

			inactivate(){
				var _this = this;
				$(document).on('click', 'body', function(){
					_this.showToggle = false;
					$('.select-header').removeClass('select-header-active').addClass('select-header-normal');
				});	

				$(document).on('click', '.select-header, .select-list', function(e){
					$(this).addClass('select-header-active').removeClass('select-header-normal');
					e.stopPropagation();
				});		
			},			
		},

		watch: {
			//immediately assign after items is filled
			items(newVal, oldVal) {
				if(oldVal.length === 0) {
					this.filtered_items = this.items;
				}
			},

			item_search_state(newVal, oldVal) {
				if(!newVal) {
					this.filtered_items = this.items;

				} else {
					//adapt to both class list and report list
					if(this.items[1].hasOwnProperty('class_name')) {
						this.filtered_items = this.items.filter( item => item.class_name.indexOf(this.item_search_state) != -1);

					} else if(this.items[1].hasOwnProperty('name')) {
						this.filtered_items = this.items.filter( item => item.name.indexOf(this.item_search_state) != -1);
					}				
					if(this.filtered_items.length === 0) {
						this.item_id = null;
						this.filtered_items = this.items;
					}
				}
			}
		},

		mounted(){
			this.inactivate();
		}
	}
</script>

<style type="text/css" scoped>
.allitems {
	display: inline-block; 
	position: relative;
}

.select-header {
	background: #ffffff;
	box-sizing: border-box;
	font-size: 14px;
	margin-top: 10px;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 5px;
	width: 200px;
	height: 36px;
	border-radius: 4px;

}

.init-place-holder {
	width: 100%;
	height: 44px;
}

.place-holder {
	position: absolute;
	top: 52px;
	left: 5px;
	z-index: 100;
	width: 175px;
	height: 46px;
	background: #ffffff;
}

.select-sub-header {
	position: absolute;
	left: 0px;
	top: 50px;
	z-index: 100;
	background: #ffffff;
	color: #666666;
	box-sizing: border-box;
	font-size: 14px;
	margin: 5px;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 5px;
	width: 85%;
	height: 36px;
	border-radius: 4px;
	border: 1px solid rgba(204, 204, 204, 0.5);
}

input::-webkit-input-placeholder {
	color: #aab2bd;
}

.select-header-normal {
	border: 1px solid rgba(204, 204, 204, 0.5);
	/*box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);*/
}

.select-header-active {
	border: 1px solid #619cde;
	/*box-shadow: 0 1px 6px rgba(97, 156, 222, 0.2);*/
}

.select-list {
	box-sizing: border-box;
	background: #ffffff;
	position: absolute;
	z-index: 10;
	margin: auto;
	padding-left: 5px;
	padding-right: 5px;
	margin-top: 5px;
	width: 200px;
	height: 100%;
	border: 1px solid #cccccc;
	border-radius: 4px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
	overflow-y: scroll; 
	height: 190px;
	overflow: auto;
	color: #666666;
}

.togglesign {
	float: right;
	font-size: 8px;
	color: #cccccc;
	cursor: pointer;
	margin-top: 5px;
}

.select-header-text, .togglesign {
	display: inline-block;
}

.select-header-text {
	border: none;
	color: #666666;
}

.select-header-text:focus {
	outline: none;
}

.select-item {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer !important;
	font-size: 14px;
	margin: 5px;
	height: 30px;
	line-height: 30px;
}

.select-item:hover {
	background: #f7f8fc;
}

</style>