	//const url_prefix = '/mengoo/index.php/';
	//const url_prefix = '/mengoo/';
	const url_prefix = '/mengoo-esp/';

	const school_usr_login = url_prefix + 'site/login';
	//const school_usr_login = url_prefix + 'esp/site/esp-login';

	const password_encrypt = url_prefix + 'site/pk';
	const logout = url_prefix + 'site/logout';
	const get_template = url_prefix + 'site/get-tpl';
	const batch_upload = url_prefix + 'site/batch-signup';
	const status_check = url_prefix + 'site/profile';


	const school_list = url_prefix + 'user/school/search';

	const teacher_list = url_prefix + 'user/teacher/search';
	const teacher_create = url_prefix + 'user/teacher/create';
	const teacher_update = url_prefix + 'user/teacher/update';
	const teacher_delete = url_prefix + 'user/teacher/delete';

	const student_list = url_prefix + 'user/student/search';
	const student_create = url_prefix + 'user/student/create';
	const student_update = url_prefix + 'user/student/update';
	const student_delete = url_prefix + 'user/student/delete';


	//const exp_list = url_prefix + 'esp_admin/experiment/search';
	const exp_list = url_prefix + 'esp_admin/experiment-assign/assign-list';
	const exp_tlist = url_prefix + 'esp_admin/experiment-assign/teacher-list';
	const exp_teacher_add = url_prefix + 'esp_admin/experiment-auth/add-teachers';
	const exp_teacher_list = url_prefix + 'esp_admin/experiment-auth/list';
	const exp_teacher_delete = url_prefix + 'esp_admin/experiment-auth/del-teachers';
	//const exp_check = url_prefix + 'esp_admin/experiment/questions';
	//const exp_create = url_prefix + 'esp_admin/experiment-assign/create';
	//const exp_update = url_prefix + 'esp_admin/experiment/update';
	//const exp_delete = url_prefix + 'esp_admin/experiment/delete';

	const expcatag_list = url_prefix + 'esp_admin/experiment-category/list';

	//const exam_list = url_prefix + 'esp_admin/exam/search';
	const exam_list = url_prefix + 'esp_admin/examine/list';
	const exam_create = url_prefix + 'esp_admin/examine/create';
	const exam_update = url_prefix + 'esp_admin/exam/update';
	const exam_delete = url_prefix + 'esp_admin/exam/delete';

	const question_list = url_prefix + 'esp_admin/questions-bank/list';
	const question_update = url_prefix + 'esp_admin/questions-bank/update';
	const question_delete = url_prefix + 'esp_admin/questions-bank/delete';
	const question_create = url_prefix + 'esp_admin/questions-bank/create';

	const class_create = url_prefix + 'user/school-class/create';
	const class_addteacher = url_prefix + 'user/school-class/add-teacher';
	const class_delteacher = url_prefix + 'user/school-class/del-teacher';
	const class_update = url_prefix + 'user/school-class/update';
	const class_delete = url_prefix + 'user/school-class/delete';

	const class_list = url_prefix + 'user/school-class/search';
	const record_list = url_prefix + 'esp_admin/exper-record/list';
	const more_records = url_prefix + 'esp_admin/exper-record/get-records';
	const exp_exam_list = url_prefix + 'esp_admin/exper-record/exam-list';
	const exam_details = url_prefix + 'esp_admin/exper-record/exam-detail';
	const record_delete = url_prefix + 'esp_admin/exper-record/clear-record';

	const download_url = url_prefix + 'esp/esp-software/download';

	//school manager
	const manager_list = url_prefix + 'user/school-admin/search';
	const manager_create = url_prefix + 'user/school-admin/create';
	const manager_update = url_prefix + 'user/school-admin/update';

	const super_admin_group = 0;
	const school_admin_group = 1;
	const teacher_group = 2;
	const student_group = 3;

	export default {
		super_admin_group,
		url_prefix,
		
		school_usr_login,
		password_encrypt,
		logout,
		get_template,
		batch_upload,
		status_check,

		school_list,
		
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
		//exp_check,
		//exp_create,
		//exp_update,
		//exp_delete,
		exp_teacher_add,
		exp_teacher_list,
		exp_teacher_delete,

		expcatag_list,

		exam_list,
		exam_create,
		exam_update,
		exam_delete,

		question_list,
		question_update,
		question_delete,
		question_create,

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
		manager_update
	}