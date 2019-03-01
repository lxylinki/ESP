<template>
	<div id="searchselect">
	    <div class="allitems" style="display: inline-block;">
	    	<div class="select-header select-header-normal">
		    	<input type="text" class="select-header-text" v-on:focus="showToggle=true" v-model="selected_item"></input>
				<i class="iconfont togglesign" v-on:click="toggleList()" v-show="!showToggle">&#xe607;</i>
				<i class="iconfont togglesign" v-on:click="toggleList()" v-show="showToggle">&#xe608;</i>
	    	</div>

			<div class="select-list" v-show="showToggle" style="overflow-y: scroll; height: 190px;">
				<input type="text" class="select-sub-header" v-show="showToggle" v-model="item_search_state"></input>
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
				this.selected_item = item.class_name;
				this.item_id = item.id;
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
					$('.select-header').addClass('select-header-active').removeClass('select-header-normal');
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
					this.filtered_items = this.items.filter( item => item.class_name.indexOf(this.item_search_state) != -1);
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

.select-sub-header {
	background: #ffffff;
	box-sizing: border-box;
	font-size: 14px;
	margin-top: 10px;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 5px;
	width: 100%;
	height: 36px;
	border-radius: 4px;
	border: 1px solid #cccccc;
}

.select-header-normal {
	border: 1px solid #cccccc;
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
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.togglesign {
	float: right;
	font-size: 12px;
	color: #cccccc;
	cursor: pointer;
}

.select-header-text, .togglesign {
	display: inline-block;
}

.select-header-text {
	border: none;
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

.highlight {
	background: #f7f8fc;
}

.select-text {
	width: 100%;
}
	
</style>