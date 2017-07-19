function ajax(type,url,flag,success){
	var xml =null;
	if (window.XMLHttpRequest) {
		xml=new XMLHttpRequest();
	}else{
		xml=new ActiveXObject("Microsoft.XMLHttp")
	}
	xml.open(type,url,flag);
	xml.send();
	xml.onreadystatechange=function(){
		if (xml.readyState==4) {
			if (xml.status==200) {
				success && success(JSON.parse(xml.responseText));
			}
		}
	}
}