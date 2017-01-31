// ==UserScript==
// @name        Weibo Follow Clean
// @namespace   esterTion
// @description Rewrite from @TimeCompass
// @include     http://weibo.com/*
// @version     1
// @grant       none
// ==/UserScript==

/*
@author esterTion
改编自 TimeCompass/weibo-follow-clean (https://github.com/TimeCompass/weibo-follow-clean)
*/

if(window.parent!=window)
	return;
console.log('init',$CONFIG['uid']);
if($CONFIG['uid']==undefined)
	return;
var uid=$CONFIG['uid'],
url='http://weibo.com/'+uid+'/fans?',
unurl='http://weibo.com/aj/f/remove',
param={
	'pids':'Pl_Official_RelationFans__88',
	'cfs':'600',
	'relate':'fans',
	't':1,
	'f':1,
	'ajaxpagelet':'1',
	'ajaxpagelet_v6':'1',
	'Pl_Official_RelationFans__88_page':10,
	'__ref':'/'+uid+'/fans?topnav=1&wvr=6&mod=message&need_filter=1&is_search=1',
	'_t':'FM_'+Date.now()
},
logarr=[],
log=function(str){
	console.log(str);
	logarr.push(str);
},
buildParam=function(param){
	var i,arr=[];
	for(i in param){
		arr.push(encodeURIComponent(i)+'='+encodeURIComponent(param[i]))
	}
	return arr.join('&');
},
xhrRequest=function(isPost,url,postdata,callback){
	var xhr=new XMLHttpRequest(),poststr='';
	xhr.open(isPost?'POST':'GET',url,true);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				callback(xhr.response)
			}else{
				callback({code:-502})
			}
		}
	}
	if(isPost){
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		poststr=buildParam(postdata);
	}
	xhr.send(poststr);
},
remove=function(fandata){
	log('移除粉丝 '+fandata.fnick);
	xhrRequest(true,unurl,fandata,removeCallback);
},
removeCallback=function(resp){
	try{
		var json=JSON.parse(resp);
		if(json.code==100000){
			log('成功');
		}else{
			log('失败');
		}
	}catch(e){
		log('失败');
	}
	mainLoop();
},
main=function(){
	log(param['Pl_Official_RelationFans__88_page']);
	xhrRequest(false,url+buildParam(param),{},processor);
},
processList=[],
processor=function(resp){
	log('loaded page');
	resp=resp.replace('<script'+'>parent.FM.view(','').replace(')</'+'script>','');
	var json=JSON.parse(resp),
	parser=new DOMParser(),
	content=parser.parseFromString(json.html, "text/html");
	window.tempContent=content;
	var fanlist=content.querySelectorAll('.info_name.W_fb.W_f14'),i=0,fan,name,wid,datas,data=[];
	window.fanlist=fanlist;
	for(;i<fanlist.length;i++){
		fan=fanlist[i];
		name=fan.querySelector('a').innerHTML;
		wid=fan.querySelector('a').getAttribute('usercard').split('&')[0].substr(3);
		datas=fan.parentNode.querySelectorAll('.info_name.W_fb.W_f14+div>span>em>a');
		data[0]=datas[0].innerHTML;
		data[1]=datas[1].innerHTML;
		data[2]=datas[2].innerHTML;
		// 负责的‘神奇’逻辑
		// 粉丝小于10 且 关注大于50 且 微博小于10 --> 辣鸡粉丝（会误伤）
		if( data[1]<10 && data[0]>50 && data[2]<10 )
			processList.push({uid:wid,fnick:name});
		else if(data[2]==0)
			processList.push({uid:wid,fnick:name});
	}
	mainLoop();
},
mainLoop=function(){
	if(processList.length==0){
		param.Pl_Official_RelationFans__88_page--;
		if(param.Pl_Official_RelationFans__88_page<1){
			log('目前只操作十页，退出');
			param.Pl_Official_RelationFans__88_page=10;
			return;
		}
		main();
		return;
	}
	var next=processList.shift();
	remove(next);
};
setTimeout(function(){
	var before=document.querySelector('.gn_topmenulist_set ul li.line.S_line1'),temp=document.createElement('li');
	before.parentNode.insertBefore(temp,before);
	temp.outerHTML='<li class="line S_line1"></li><li><a id="weiboFollowClean" title="日志输出至控制台">开始搞事</a></li><li><a id="weiboFollowClean_log" title="日志输出至控制台">搞事记录</a></li>'
	document.getElementById('weiboFollowClean').addEventListener('click',function(){
		alert('备好F12，暂时不弄UI');
		main();
	});
	document.getElementById('weiboFollowClean_log').addEventListener('click',function(){
		console.log(logarr.join('\n'));
	});
},5e3)

window.weiboFollowClean=main;
window.weiboFollowClean.logs=logarr;