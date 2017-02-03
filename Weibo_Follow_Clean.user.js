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
outputLog=function(){
	var dest=document.getElementById('weiboFollowCleanLog'),i=0;
	if(dest==null)
		return;
	dest.innerHTML=logarr.join('\n');
	dest.scrollTop=dest.scrollHeight;
},
log=function(str,replaceLast){
	if(replaceLast!=undefined)
		logarr.pop();
	logarr.push(str);
	outputLog();
},
buildParam=function(param){
	var i,arr=[];
	for(i in param){
		arr.push(encodeURIComponent(i)+'='+encodeURIComponent(param[i]))
	}
	return arr.join('&');
},
xhrRequest=function(isPost,url,postdata,callback,callbackData){
	var xhr=new XMLHttpRequest(),poststr='';
	xhr.open(isPost?'POST':'GET',url,true);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				callback(xhr.response,callbackData)
			}else{
				callback('{"code":-502,"msg":"网络错误"}',callbackData)
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
	xhrRequest(true,unurl,fandata,removeCallback,fandata);
},
removeCallback=function(resp,fandata){
	try{
		var json=JSON.parse(resp);
		if(json.code==100000){
			log('移除粉丝 <a usercard="id='+fandata.uid+'" href="/u/'+fandata.uid+'" target="_blank">'+fandata.fnick+'</a> 成功');
		}else{
			log('移除粉丝 <a usercard="id='+fandata.uid+'" href="/u/'+fandata.uid+'" target="_blank">'+fandata.fnick+'</a> 失败:['+json.code+']'+json.msg);
		}
	}catch(e){
		log('移除粉丝 <a usercard="id='+fandata.uid+'" href="/u/'+fandata.uid+'" target="_blank">'+fandata.fnick+'</a> 失败:'+resp);
	}
	mainLoop();
},
main=function(){
	logarr.push('\n----------'+new Date().toLocaleString()+'----------\n');
	logarr.push('');
	while(param.Pl_Official_RelationFans__88_page>=1){
		xhrRequest(false,url+buildParam(param),{},processor,param.Pl_Official_RelationFans__88_page--);
	}
	param.Pl_Official_RelationFans__88_page=10;
},
processList=[],
loadedCount=0,
parser=new DOMParser(),
processor=function(resp,page){
	log('已获取粉丝列表 '+(loadedCount+1)+'/10页',true);
	resp=resp.replace('<script'+'>parent.FM.view(','').replace(')</'+'script>','');
	var json=JSON.parse(resp),
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
	if(++loadedCount==10){
		mainLoop();
		loadedCount=0;
	}
},
mainLoop=function(){
	var next;
	while(processList.length>0){
		next=processList.shift();
		remove(next);
	}
};
setTimeout(function(){
	var before=document.querySelector('.gn_topmenulist_set ul li.line.S_line1'),temp=document.createElement('li');
	before.parentNode.insertBefore(temp,before);
	temp.outerHTML='<li class="line S_line1"></li><li><a id="weiboFollowClean" title="日志输出至控制台">开始搞事</a></li>'
	document.getElementById('weiboFollowClean').addEventListener('click',function(){
		STK.ui.dialog({title: '搞事记录', content: '<div class="layer_dialogue_v5"><div style="width:100%;height:200px;white-space:pre-wrap;word-break:break-all;overflow:auto;line-height:16px" id="weiboFollowCleanLog"></div></div>'}).show()
		main();
	});
},1e3)

window.weiboFollowClean=main;
window.weiboFollowClean.logs=logarr;