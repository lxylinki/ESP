import Vue from 'vue';
//import and use VueRouter
import VueRouter from 'vue-router';
Vue.use(VueRouter);


//0. log in page
const Login = ()=> import('@/components/accountmanage/Login.vue');
const TestLogin = ()=> import('@/components/accountmanage/TestLogin.vue');
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

//Score Statistics: updated
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

const ExpList = ()=> import('@/components/reportmanage/studentlist/ExpList.vue');
const ExpScore = ()=> import('@/components/reportmanage/studentscore/ExpScore.vue');
const viewGrade = ()=> import('@/components/reportmanage/studentscore/viewGrade.vue');

//Experiment Report
//const ReportManage = ()=> import('@/components/reportmanage/ReportManage.vue');

//Version Update
//const UpdateNote = ()=> import('@/components/versionupdate/UpdateNote.vue');
//const DownloadUpdate = ()=> import('@/components/versionupdate/DownloadUpdate.vue');

//const TestGround = ()=> import('@/components/versionupdate/TestGround.vue');

//2. set route paths
const myRoutes = [
	{path: '/login', meta: {title: '??????'}, component: Login},
	{path: '/test_login', meta: {title: '????????????'}, component: TestLogin},
	/*Dummy page, not for visiting*/
	{path: '/esp', 
	 meta: {title: 'ESP'}, 
	 component: AppInner,
	 children:[
		{path: '/classmanage',  meta: {title: '????????????'}, component: ClassManage},
		{path: '/classadd',  meta: {title: '????????????'}, component: ClassAdd},
		{path: '/classedit', meta: {title: '????????????'}, component: ClassEdit},
		
		{path: '/studentadd',  meta: {title: '????????????'}, component: StudentAdd},
		{path: '/studentmanage',  meta: {title: '????????????'}, component: StudentManage},
		{path: '/studentedit', meta: {title: '????????????'}, component: StudentEdit},
		
		{path: '/teacheradd',  meta: {title: '????????????'}, component: TeacherAdd},
		{path: '/teachermanage',  meta: {title: '????????????'}, component: TeacherManage},
		{path: '/teacheredit', meta: {title: '????????????'}, component: TeacherEdit},

		{path: '/manageradd',  meta: {title: '???????????????'}, component: ManagerAdd},
		{path: '/managermanage',  meta: {title: '???????????????'}, component: ManagerManage},
		{path: '/manageredit', meta: {title: '???????????????'}, component: ManagerEdit},
		

		{path: '/expmanage', meta: {title:'??????????????????'}, component: ExpManage},


		{path: '/exammanage', meta: {title:'????????????'}, component: ExamManage},
		{path: '/examquesconfig', meta: {title: '????????????'}, component: ExamQuesConfig},


		{path: '/questionmanage', meta: {title:'??????????????????'}, component: QuesManage},
		{path: '/questionadd', meta: {title:'??????????????????'}, component: QuesAdd},
		{path: '/questionedit', meta: {title: '??????????????????'}, component: QuesEdit},

		{path: '/teacherstats', meta: {title:'????????????'}, component: TeacherStat},
		{path: '/studentstats', meta: {title:'????????????'}, component: StudentStat},

		{path: '/tplmanage', meta: {title: '????????????'}, component: TplManage},
		{path: '/tpladd', meta: {title: '????????????'}, component: TplAdd},

		{path: '/expreport', meta: {title: '????????????'}, component: ExpReport},
		{path: '/reportadd', meta: {title: '????????????'}, component: ReportAdd},
		{path: '/reportstats', meta: {title: '????????????'}, component: ReportStats},

		{path: '/reportrec', meta:{title: '??????????????????'}, component: ReportRec},
		{path: '/reportgrade', meta:{tiitle: '??????????????????'}, component: ReportGrade},

		{path: '/reportscore', meta:{title: '????????????'}, component: ReportScore},

		{path: '/explist', meta:{title: '????????????'}, component: ExpList},
		{path: '/expscore', meta:{title: '????????????'}, component: ExpScore},
		{path: '/viewgrade', meta:{title: '????????????'}, component: viewGrade},
		//{path: '/updatenote', meta: {title: '????????????'}, component: UpdateNote},
		//{path: '/downloadupdate', meta: {title: '????????????'}, component: DownloadUpdate},

		//{path: '/reportmanage', meta: {title: '??????????????????'}, component: ReportManage}  
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

//?????????????????????
router.beforeEach((to, from, next)=>{
	window.document.title = to.meta.title;
	next();
	//console.log(from,to);
});

export default router;
