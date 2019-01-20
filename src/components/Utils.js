import RSAKey from '@/assets/js/rsa.min.js';
import Base from '@/assets/js/base64.js';
import global_ from '@/components/Global.js';

export default {
	lalert(text) {
		layer.alert(text, {title:'提示', area:['280px','190px']});
	},

	lconfirm(text, func) {
		layer.confirm(text, {title:'提示', area:['280px','190px']}, func);		
	},

	encrypt(pswd){
		return new Promise((resolve, reject)=>{
			let nonce, pk, ts, encrypt, epassword;
			var encryptapi = global_.password_encrypt;

			this.$http.post(encryptapi, {}).then((encrypt_response)=>{

				nonce = encrypt_response.body.nonce;
				pk = encrypt_response.body.pk;
				ts = encrypt_response.body.ts;	
				
				let newEncrypter = new RSAKey();
				newEncrypter.setPublic(pk,"10001");
				epassword = Base.hex2b64(newEncrypter.encrypt(JSON.stringify([ts, nonce, pswd])));
				resolve(epassword);

			},(err)=>{
				Utils.lalert('请求加密失败');
				console.log(err);
			});			
		});
	},

	convTime(ntime) {
		var unixTime = new Date(ntime * 1000);
		
		var y = unixTime.getFullYear();
		var m = unixTime.getMonth()+1;
		var d = unixTime.getDate();
		var h = unixTime.getHours();
		var mn = unixTime.getMinutes();

		var commonTime = y + '-'
		               + this.add0(m) + '-'
		               + this.add0(d) + ' '
		               + this.add0(h) + ':' 
		               + this.add0(mn);
		               
		return commonTime;
	},

	reqExpList(keyword, page){
		return new Promise((resolve, reject)=>{
		    var list_api = global_.exp_list
						 + '?page=' 
						 + page; 

			let req_data = {
				"search": {
					"name": keyword
				}
			};

		    this.$http.post(list_api, req_data).then((resp)=>{
		    	var total_exp = resp.body.total;
		    	var full_list_api = list_api + '&pagesize='+ total_exp; 

		    	this.$http.post(full_list_api, req_data).then((resp)=>{
		    		resolve(resp);

		    	},(err)=>{
		    		Utils.lalert('请求实验列表失败');
			      	console.log(err);	    		
		    	});

		    }, (err)=>{
		    	layer.alert('请求实验列表失败',
		    		{title:'提示', area:['280px','190px']});
		      	console.log(err);
		    });  	
		});
     },

	reqClassList(tkeyword, ckeyword, page){
		return new Promise((resolve, reject)=>{
	    	var class_api = global_.class_list
	     				  + '?page='
	     				  + page; 
	     				  //+ '&pagesize='
	     				  //+ this.rowsPerPage;
	     	let req_data = {
	     		"search": {
	     			"teacher_name": tkeyword,
	     			"class_name": ckeyword
	     		}
	     	};

	     	this.$http.post(class_api, req_data).then((resp)=>{
	     		var total_class = resp.body.total;
	     		var full_list_api = class_api + '&pagesize='+ total_class;

	     		this.$http.post(full_list_api, req_data).then((resp)=>{
	     			resolve(resp);

	     		}, (err)=>{
	     			Utils.lalert('请求班级列表失败');
	     			console.log(err);
	     		});

	     	}, (err)=>{
	     		Utils.lalert('请求班级列表失败');
	     		console.log(err);
	     	});
		});
     },

	reqTeacherList(keyword, page){
		return new Promise((resolve, reject)=>{
		    //list request
		    var list_api = global_.teacher_list
						 + '?page=' 
						 + page; 
						 //+ '&pagesize=' 
						 //+ this.rowsPerPage;

		    let req_data = {
		    	'status': this.status_value,
		      	'search': {
		      		'username': keyword,
		      		'realname': ''
		      	}
		    }

		    this.$http.post(list_api, req_data).then((resp)=>{
		    	var total_teacher = resp.body.total;
		    	var full_list_api = list_api + '&pagesize=' + total_teacher;

		    	this.$http.post(full_list_api, req_data).then((resp)=>{
		    		resolve(resp);

		    	},(err)=>{
			    	Utils.lalert('请求列表失败');
			    	console.log(err);
		    	});

		    },(err)=>{
		    	Utils.lalert('请求列表失败');
		    	console.log(err);
		    });					
		});	
	},
	
	obj_equal(obj1, obj2) {
		var result = true;
		for (var i in obj1) {
			if(obj1[i] != obj2[i]){
				result = false;
				break;
			}
		}
		return result;
	},

	contains_obj(list, item) {
		var result = false;
		for(var i in list) {
			if(this.obj_equal(list[i], item)) {
				result = true;
				break;
			}
		}
		return result;
	},
}