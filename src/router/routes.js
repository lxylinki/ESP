import Vue from 'vue';
//import and use VueRouter
import VueRouter from 'vue-router';
Vue.use(VueRouter);


//0. log in page
const Login = ()=> import('../components/accountmanage/Login.vue');
//const MobileLogin = ()=> import('../components/accountmanage/MobileLogin.vue');
const AppInner = ()=> import('../AppInner.vue');

//1. create components
//Account Manage
const AccountManage = ()=> import('../components/accountmanage/AccountManage.vue');

const ClassManage = ()=> import('../components/accountmanage/classmanage/ClassManage.vue');
const ClassAdd = ()=> import('../components/accountmanage/classmanage/ClassAdd.vue');
const ClassEdit = ()=> import('../components/accountmanage/classmanage/ClassEdit.vue');

const StudentAdd = ()=> import('../components/accountmanage/studentmanage/StudentAdd.vue');
const StudentManage = ()=> import('../components/accountmanage/studentmanage/StudentManage.vue');
const StudentEdit = ()=> import('../components/accountmanage/studentmanage/StudentEdit.vue');

const TeacherAdd = ()=> import('../components/accountmanage/teachermanage/TeacherAdd.vue');
const TeacherManage = ()=> import('../components/accountmanage/teachermanage/TeacherManage.vue');
const TeacherEdit = ()=> import('../components/accountmanage/teachermanage/TeacherEdit.vue');

const ManagerAdd = ()=> import('../components/accountmanage/managermanage/ManagerAdd.vue');
const ManagerManage = ()=> import('../components/accountmanage/managermanage/ManagerManage.vue');
const ManagerEdit = ()=> import('../components/accountmanage/managermanage/ManagerEdit.vue');

//Experiment Manage
const ExpManage = ()=> import('../components/expmanage/ExpManage.vue');
const ExpAdd = ()=> import('../components/expmanage/ExpAdd.vue');
const ExpEdit = ()=> import('../components/expmanage/ExpEdit.vue');

//Exam Manage
const ExamManage = ()=> import('../components/exammanage/ExamManage.vue');
const ExamAdd = ()=> import('../components/exammanage/ExamAdd.vue');
const ExamEdit = ()=> import('../components/exammanage/ExamEdit.vue');

//Question Manage
const QuestionManage = ()=> import('../components/questionmanage/QuestionManage.vue');
const QuestionAdd = ()=> import('../components/questionmanage/QuestionAdd.vue');

//Score Statistics
const TeacherStat = ()=> import('../components/scorestats/TeacherView.vue');
const StudentStat = ()=> import('../components/scorestats/StudentView.vue');

//Experiment Report
const ReportManage = ()=> import('../components/reportmanage/ReportManage.vue');

//Version Update
const UpdateNote = ()=> import('../components/versionupdate/UpdateNote.vue');
const DownloadUpdate = ()=> import('../components/versionupdate/DownloadUpdate.vue');

//const TestGround = ()=> import('../components/versionupdate/TestGround.vue');

//2. set route paths
const myRoutes = [
	{path: '/login', meta: {title: '登陆'}, component: Login},
	//{path: '/mlogin', meta: {title: '登陆'}, component: MobileLogin},
	/*Dummy page, not for visiting*/
	{path: '  ', 
	 meta: {title: 'ESP'}, 
	 component: AppInner,
	 children:[
	 	
	 	//{path: '/accmanage', meta: {title: '账号管理'}, component: AccountManage},
		{path: '/classmanage',  meta: {title: '班级管理'}, component: ClassManage},
		{path: '/classadd',  meta: {title: '班级创建'}, component: ClassAdd},
		{path: '/classedit', meta: {title: '班级创建'}, component: ClassEdit},
		
		{path: '/studentadd',  meta: {title: '学生管理'}, component: StudentAdd},
		{path: '/studentmanage',  meta: {title: '学生管理'}, component: StudentManage},
		{path: '/studentedit', meta: {title: '学生管理'}, component: StudentEdit},
		
		{path: '/teacheradd',  meta: {title: '教师管理'}, component: TeacherAdd},
		{path: '/teachermanage',  meta: {title: '教师管理'}, component: TeacherManage},
		{path: '/teacheredit', meta: {title: '教师管理'}, component: TeacherEdit},

		{path: '/manageradd',  meta: {title: '管理员管理'}, component: ManagerAdd},
		{path: '/managermanage',  meta: {title: '管理员管理'}, component: ManagerManage},
		{path: '/manageredit', meta: {title: '管理员管理'}, component: ManagerEdit},
		

		{path: '/expmanage', meta: {title:'实验管理'}, component: ExpManage},
		{path: '/expadd', meta: {title:'实验管理'}, component: ExpAdd},
		{path: '/expedit',  meta: {title:'实验管理'}, component: ExpEdit},


		{path: '/exammanage', meta: {title:'考核管理'}, component: ExamManage},
		{path: '/examadd', meta:{title:'考核管理'}, component: ExamAdd},
		{path: '/examedit', meta: {title:'考核管理'}, component: ExamEdit},


		{path: '/questionmanage', meta: {title:'试卷管理'}, component: QuestionManage},
		{path: '/questionadd', meta: {title:'试卷管理'}, component: QuestionAdd},

		{path: '/teacherstats', meta: {title:'成绩统计'}, component: TeacherStat},
		{path: '/studentstats', meta: {title:'成绩统计'}, component: StudentStat},

		{path: '/updatenote', meta: {title: '版本更新'}, component: UpdateNote},
		{path: '/downloadupdate', meta: {title: '版本更新'}, component: DownloadUpdate},

		{path: '/reportmanage', meta: {title: '实验报告管理'}, component: ReportManage}
		//{path: '/testpage', meta: {title: 'Test'}, component: TestGround}
	 ]
	},

	{path: '*', redirect: '/login'}	/*default when no match*/
	
];

//3. instanciate router from VueRouter
const router = new VueRouter({
	//hash or history
	//mode: 'history',
	mode: 'hash',
	routes: myRoutes
});

//显示每页的标题
router.beforeEach((to, from, next)=>{
	window.document.title = to.meta.title;
	next();
});

export default router;
