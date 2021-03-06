	const url_prefix = '/mengoo-esp/';

	const school_usr_login = url_prefix + 'site/login';

	//for test only
	const school_test_login = url_prefix + 'esp/site/login';
	const test_encrypt = url_prefix + 'esp/site/pk';


	const password_encrypt = url_prefix + 'site/pk';
	const logout = url_prefix + 'site/logout';
	const get_template = url_prefix + 'site/get-tpl';
	const batch_upload = url_prefix + 'site/batch-signup';
	const status_check = url_prefix + 'site/profile';


	const teacher_list = url_prefix + 'user/teacher/search';
	const teacher_create = url_prefix + 'user/teacher/create';
	const teacher_update = url_prefix + 'user/teacher/update';
	const teacher_delete = url_prefix + 'user/teacher/delete';

	const student_list = url_prefix + 'user/student/search';
	const student_create = url_prefix + 'user/student/create';
	const student_update = url_prefix + 'user/student/update';
	const student_delete = url_prefix + 'user/student/delete';

	const exp_list = url_prefix + 'esp_admin/experiment-assign/assign-list';
	const exp_slist = url_prefix + 'esp_admin/experiment-assign/list';
	const exp_tlist = url_prefix + 'esp_admin/experiment-assign/teacher-list';
	
	const exp_teacher_add = url_prefix + 'esp_admin/experiment-auth/add-teachers';
	const exp_teacher_list = url_prefix + 'esp_admin/experiment-auth/list';
	const exp_teacher_delete = url_prefix + 'esp_admin/experiment-auth/del-teachers';


	const expcatag_list = url_prefix + 'esp_admin/experiment-category/list';

	const exam_list = url_prefix + 'esp_admin/examine/list';
	const exam_ques_list = url_prefix + 'esp_admin/examine-questions/list';
	const exam_ques_create = url_prefix + 'esp_admin/examine-questions/create';
	const exam_ques_delete = url_prefix + 'esp_admin/examine-questions/delete';


	const ques_list = url_prefix + 'esp_admin/questions-bank/list';
	const ques_create = url_prefix + 'esp_admin/questions-bank/create';
	const ques_update = url_prefix + 'esp_admin/questions-bank/update';
	const ques_delete = url_prefix + 'esp_admin/questions-bank/delete';


	const class_create = url_prefix + 'user/school-class/create';
	const class_addteacher = url_prefix + 'user/school-class/add-teacher';
	const class_delteacher = url_prefix + 'user/school-class/del-teacher';
	const class_update = url_prefix + 'user/school-class/update';
	const class_delete = url_prefix + 'user/school-class/delete';


	const class_list = url_prefix + 'user/school-class/search';
	const record_list = url_prefix + 'esp_admin/experiment-record/list';
	const more_records = url_prefix + 'esp_admin/experiment-record/get-records';
	const exp_exam_list = url_prefix + 'esp_admin/experiment-record/exam-list';
	const exam_details = url_prefix + 'esp_admin/experiment-record/exam-detail';	
	const record_delete = url_prefix + 'esp_admin/experiment-record/clear-record';

	const download_url = url_prefix + 'esp/esp-software/download';

	//school manager
	const manager_list = url_prefix + 'user/school-admin/search';
	const manager_create = url_prefix + 'user/school-admin/create';
	const manager_update = url_prefix + 'user/school-admin/update';

	const super_admin_group = 0;
	const school_admin_group = 1;
	const teacher_group = 2;
	const student_group = 3;

	//experiment report
	//exp template
	const report_tpl_list = url_prefix + 'exam/report-offline/list-tpl';
	const report_tpl_create = url_prefix + 'exam/report-offline/create-tpl';
	const report_tpl_preup = url_prefix + 'resources/resource/pre-upload';
	const report_tpl_up = url_prefix + 'resources/resource/upload';
	const report_tpl_delete = url_prefix + 'exam/report-offline/del-tpl';

	//exp report
	const report_list = url_prefix + 'exam/report-offline/list';
	const report_create = url_prefix + 'exam/report-offline/create';
	const report_pub = url_prefix + 'exam/report-offline/pub';
	const report_delete = url_prefix + 'exam/report-offline/del';
	const report_exam_close = url_prefix + 'exam/exam/close';
	const report_score_pub = url_prefix + 'exam/exam/release-score';
	const report_class_list = url_prefix + 'exam/exam-stats/class-list';

	//student
	const report_mylist = url_prefix + 'exam/exam/my-list';
	const report_slist = url_prefix + 'exam/exam/list';
	const report_myscore = url_prefix + 'exam/exam-stats/user-list';
	const report_join = url_prefix + 'exam/exam-record/join';
	const report_upload = url_prefix + 'resources/resource/upload';
	const report_answer = url_prefix + 'exam/paper-card/answer';
	const report_submit = url_prefix + 'exam/exam-record/submit';

	//exp report record
	const report_rec_list = url_prefix + 'exam/exam-record/list';
	const report_rec_view = url_prefix + 'exam/exam/view';
	const report_rec_card = url_prefix + 'exam/paper-card/view';
	const report_rec_ques = url_prefix + 'exam/exam/questions';
	const report_rec_load = url_prefix + 'resources/resource/load';
	const report_mark = url_prefix + 'exam/paper-card/mark'; //??????
	const report_rec_mark = url_prefix + 'exam/exam-record/mark'; //???????????????

	//exp report score
	const report_stats_list = url_prefix + 'exam/exam-stats/user-list';

	export default {
		super_admin_group,
		url_prefix,
		
		school_usr_login,
		password_encrypt,
		logout,
		get_template,
		batch_upload,
		status_check,
		
		teacher_list,
		teacher_create,
		teacher_update,
		teacher_delete,

		student_list,
		student_create,
		student_update,
		student_delete,

		exp_list,
		exp_tlist,
		exp_slist,
		exp_teacher_add,
		exp_teacher_list,
		exp_teacher_delete,

		expcatag_list,

		exam_list,
		exam_ques_list,
		exam_ques_create,
		exam_ques_delete,

		ques_list,
		ques_update,
		ques_delete,
		ques_create,

		class_create,
		class_addteacher,
		class_delteacher,
		class_update,
		class_delete,

		class_list,
		record_list,
		more_records,
		exp_exam_list,
		exam_details,
		record_delete,
		download_url,

		school_admin_group,
		teacher_group,
		student_group,

		manager_list,
		manager_create,
		manager_update,

		report_tpl_list,
		report_tpl_preup,
		report_tpl_up,
		report_tpl_create,
		report_tpl_delete,

		report_list,
		report_create,
		report_pub,
		report_delete,
		report_exam_close,
		report_score_pub,
		report_class_list,

		report_rec_list,
		report_rec_view,
		report_rec_card,
		report_rec_ques,
		report_rec_load,
		report_mark,
		report_rec_mark,

		report_stats_list,

		report_mylist,
		report_slist,
		report_myscore,
		report_join,
		report_upload,
		report_answer,
		report_submit,

		school_test_login,
		test_encrypt
	}