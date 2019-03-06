import Vue from 'vue';
//import and use VueRouter
import VueRouter from 'vue-router';
Vue.use(VueRouter);


//0. log in page
const Login = ()=> import('@/components/accountmanage/Login.vue');
//const MobileLogin = ()=> import('@/components/accountmanage/MobileLogin.vue');
const AppInner = ()=> import('@/AppInner.vue');

//1. create components
//Account Manage
const ClassManage = ()=> import('@/components/accountmanage/classmanage/ClassManage.vue');
const ClassAdd = ()=> import('@/components/accountmanage/classmanage/ClassAdd.vue');
const ClassEdit = ()=> import('@/components/accountmanage/classmanage/ClassEdit.vue');

const StudentAdd = ()=> import('@/components/accountmanage/studentmanage/StudentAdd.vue');
const StudentManage = ()=> import('@/components/accountmanage/studentmanage/StudentManage.vue');
const StudentEdit = ()=> import('@/components/accountmanage/studentmanage/StudentEdit.vue');

const TeacherAdd = ()=> import('@/components/accountmanage/teachermanage/TeacherAdd.vue');
const TeacherManage = ()=> import('@/components/accountmanage/teachermanage/TeacherManage.vue');
const TeacherEdit = ()=> import('@/components/accountmanage/teachermanage/TeacherEdit.vue');

const ManagerAdd = ()=> import('@/components/accountmanage/managermanage/ManagerAdd.vue');
const ManagerManage = ()=> import('@/components/accountmanage/managermanage/ManagerManage.vue');
const ManagerEdit = ()=> import('@/components/accountmanage/managermanage/ManagerEdit.vue');

//Experiment Manage
const ExpManage = ()=> import('@/components/expmanage/ExpManage.vue');

//Exam Manage
const ExamManage = ()=> import('@/components/exammanage/ExamManage.vue');
const ExamQuesConfig = ()=> import('@/components/exammanage/ExamQuesConfig.vue');

//Question Manage
const QuesManage = ()=> import('@/components/questionmanage/QuesManage.vue');
const QuesAdd = ()=> import('@/components/questionmanage/QuesAdd.vue');
const QuesEdit = ()=> import('@/components/questionmanage/QuesEdit.vue');

//Score Statistics
const TeacherStat = ()=> import('@/components/scorestats/TeacherView.vue');
const StudentStat = ()=> import('@/components/scorestats/StudentView.vue');

//Exp Report
const TplManage = ()=> import('@/components/reportmanage/tplmanage/TplManage.vue');
const TplAdd = ()=> import('@/components/reportmanage/tplmanage/TplAdd.vue');

const ExpReport = ()=> import('@/components/reportmanage/expreport/ExpReport.vue');
const ReportAdd = ()=> import('@/components/reportmanage/expreport/ReportAdd.vue');
const ReportStats = ()=> import('@/components/reportmanage/expreport/ReportStats.vue');

const ReportRec = ()=> import('@/components/reportmanage/reportrecord/ReportRec.vue');
const ReportGrade = ()=>import('@/components/reportmanage/reportrecord/ReportGrade.vue');

const ReportScore = ()=>import('@/components/reportmanage/reportscore/ReportScore.vue');

//Experiment Report
//const ReportManage = ()=> import('@/components/reportmanage/ReportManage.vue');

//Version Update
//const UpdateNote = ()=> import('@/components/versionupdate/UpdateNote.vue');
//const DownloadUpdate = ()=> import('@/components/versionupdate/DownloadUpdate.vue');

//const TestGround = ()=> import('@/components/versionupdate/TestGround.vue');

//2. set route paths
const myRoutes = [
	{path: '/login', meta: {title: '登陆'}, component: Login},
	//{path: '/mlogin', meta: {title: '登陆'}, component: MobileLogin},
	/*Dummy page, not for visiting*/
	{path: '/esp', 
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
		

		{path: '/expmanage', meta: {title:'实验项目管理'}, component: ExpManage},


		{path: '/exammanage', meta: {title:'考核管理'}, component: ExamManage},
		{path: '/examquesconfig', meta: {title: '考核管理'}, component: ExamQuesConfig},


		{path: '/questionmanage', meta: {title:'公共题库管理'}, component: QuesManage},
		{path: '/questionadd', meta: {title:'公共题库管理'}, component: QuesAdd},
		{path: '/questionedit', meta: {title: '公共题库管理'}, component: QuesEdit},

		{path: '/teacherstats', meta: {title:'成绩统计'}, component: TeacherStat},
		{path: '/studentstats', meta: {title:'成绩统计'}, component: StudentStat},

		{path: '/tplmanage', meta: {title: '模板管理'}, component: TplManage},
		{path: '/tpladd', meta: {title: '模板管理'}, component: TplAdd},

		{path: '/expreport', meta: {title: '实验报告'}, component: ExpReport},
		{path: '/reportadd', meta: {title: '实验报告'}, component: ReportAdd},
		{path: '/reportstats', meta: {title: '实验报告'}, component: ReportStats},

		{path: '/reportrec', meta:{title: '实验报告记录'}, component: ReportRec},
		{path: '/reportgrade', meta:{tiitle: '实验报告记录'}, component: ReportGrade},

		{path: '/reportscore', meta:{title: '报告成绩'}, component: ReportScore},
		//{path: '/updatenote', meta: {title: '版本更新'}, component: UpdateNote},
		//{path: '/downloadupdate', meta: {title: '版本更新'}, component: DownloadUpdate},

		//{path: '/reportmanage', meta: {title: '实验报告管理'}, component: ReportManage}  
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
	//console.log(from,to);
});

export default router;
