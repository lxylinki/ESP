import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


var state = {
	user_group: 0,
	
	//component which does the change
	last_author: '',

	//for table row editing
	row:{},
	exam_id: '',
	exp_id: '',
	
	row_num_before: 0,
	row_num_after: 0,
	rows_per_page: 0,
	current_page: 0,
	current_search:'',
	
	//detect if a page is refreshed
	edit: false
}

var mutations = {
	setUserGroup(state, group){
		state.user_group = group;
	},

	sign(state, name) {
		state.last_author = name;
	},

	//must have state as arg
	pickRow(state, picked) {
		state.row = picked;
	},

	setExamId(state, id) {
		state.exam_id = id;
	},

	setExpId(state, id) {
		state.exp_id = id;
	},
	
	setRowNumBefore(state, num){
		state.row_num_before = num;
	},

	setRowNumAfter(state, num) {
		state.row_num_after = num;
	},

	incRowNumAfter(state, num) {
		state.row_num_after += num;
	},

	setRowsPerPage(state, num){
		state.rows_per_page = num;
	},

	setCurPage(state, num){
		state.current_page = num;
	},

	setCurSearch(state, keyword) {
		state.current_search = keyword;
	},

	setEdit(state, tf) {
		state.edit = tf;
	}
}

const store = new Vuex.Store({
	state: state,
	mutations: mutations
});

export default store;
