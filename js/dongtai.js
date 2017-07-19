window.onload=function(){
			var inp=document.getElementById('inp');
			var obtn=document.getElementById('btn');
			var oul =document.getElementById('ul');
			var ali = oul.getElementsByTagName('li');
			var lyricContainer = document.getElementById('lyricContainer');

				obtn.onclick=function(){
					oul.innerHTML='';
					if (inp.value=='') {
						alert('不能为空');
						return false;
					}
					ajax('get','https://api.imjad.cn/cloudmusic/?type=search&s='+inp.value,true,function(data){
						 news(data);
				})
			}
			var off=0;
		window.onscroll=function(){
			off++;
			console.log(ali[ali.length-1].offsetTop)
			console.log(document.body.scrollTop)
			if (ali[ali.length-1].offsetTop-document.body.scrollTop<=350) {
				ajax('get','https://api.imjad.cn/cloudmusic/?type=search&offset='+ off +'&s='+inp.value,true,function(data){
						 news(data);
			 	})
			}
		}
	}
		function news(data){
			 var oul =document.getElementById('ul');	 	
			 for (var i = 0; i <data.result.songs.length; i++){ 
			 var li =document.createElement('li');
			 var img=document.createElement('img');
			 var span=document.createElement('span');
			 var p=document.createElement('p');
			 var b=document.createElement('b');
			  img.setAttribute('src',data.result.songs[i].al.picUrl);
			  span.setAttribute('data-id',data.result.songs[i].id);
			 	span.setAttribute('name',data.result.songs[i].name);
			 	span.setAttribute('name-id',data.result.songs[i].ar[0].name);
			 	p.setAttribute('p-id',data.result.songs[i].ar[0].name);
			  img.setAttribute('alt',data.result.songs[i].mv);
			  	b.setAttribute('id',data.result.songs[i].mv);
			  if (img.getAttribute('alt')!=0) {
			  	var b=document.createElement('b');
			  	b.setAttribute('id',data.result.songs[i].mv);
			  	b.innerHTML='&#xe61a;';
			  	  li.appendChild(b);
			  }
			  span.innerText=data.result.songs[i].name;
			  p.innerText=data.result.songs[i].ar[0].name;
			  li.appendChild(img);
			  li.appendChild(span);	 
			  li.appendChild(b);
			  li.appendChild(p);
			  oul.appendChild(li); 
			 }
				oul.onclick=function(e){
					var o=e||window.event;
					var target=o.srcElement||o.target;
					var audio=document.getElementById('audio');
					var video=document.getElementById('video');
					if (target.nodeName.toLowerCase()=='span') {
						ajax('get','https://api.imjad.cn/cloudmusic/?type=song&id='+target.getAttribute('data-id')+'&br=128000',true,function(data){
							 var url=data.data[0].url;
							audio.setAttribute('src',url);

									ajax("get","https://api.imjad.cn/cloudmusic/?type=lyric&id="+target.getAttribute('data-id')+'&br=128000',true,function(data){
										var lyric = JSON.stringify(data.lrc.lyric);
								    //显示歌词的元素
								    var arr_lyric = [];
										var reg = /\[\d{2}:\d{2}.\d{1,3}\]/g;
										var reg2 = /\[\d{2}:\d{2}.\d{1,3}\]/g;
								    var arr_lyric = lyric.slice(1,-1);

										var arr_lyric = arr_lyric.split(/\\n/g);
										var arr_lyric_time = [];
										var arr_lyric_body = [];

										for(var i=0;i<arr_lyric.length-1;i++){
										 	arr_lyric_time.push(arr_lyric[i].match(reg));

										 	arr_lyric_body.push(arr_lyric[i].replace(reg2, ''));
										}

										var mins_reg = /\d{2}:/g;

										var change_time =[];


										arr_lyric_time.forEach( function(arr, index) {
											var arr2;
											if(arr != null){
												arr2 = arr.toString();
											}else{
												arr2 = '[00:00.00]';
											}

											var t = arr2.slice(1, -1).split(':');

											arr_lyric.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), arr_lyric_body[index]])
										});
										for(var i=0;i<arr_lyric.length;i++){
											// console.log(arr_lyric[i])
										}
										audio.ontimeupdate = function(){
											for(var i=0;i<arr_lyric.length;i++){
												if(this.currentTime >= arr_lyric[i][0]){
													lyricContainer.innerHTML = '';
													var li = document.createElement('li');
													li.innerText = arr_lyric[i][1];
													lyricContainer.appendChild(li)
												}
											}
										}
									}
								)
						})	
							audio.style.display='block';
							video.style.display='none';
							video.pause();

							var dox=document.getElementById('dox');
							 	dox.innerHTML='';
							var span=document.createElement('span');
							span.innerHTML=target.getAttribute('name')+"—"+target.getAttribute('name-id');
							dox.appendChild(span);
					}
					var video=document.getElementById('video');
					if (target.nodeName.toLowerCase()=='b') {
						ajax('get','https://api.imjad.cn/cloudmusic/?type=mv&id='+target.getAttribute('id')+'&br=128000',true,function(data){
							  var arr =[];
							 for(i in data.data.brs){
							 	if (data.data.brs.hasOwnProperty(i)) {
							 		arr.push(data.data.brs[i]);
							 	}
							 }
							 video.setAttribute('src',arr[1])
						})
						
							video.style.display='block';
							audio.pause();
					}
				}
				function parseLyric(text) {
			    //将文本分隔成一行一行，存入数组
			    var lines = text.split('\n'),
			        //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
			        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
			        //保存最终结果的数组
			        result = [];
			    //去掉不含时间的行
			    while (!pattern.test(lines[0])) {
			        lines = lines.slice(1);
			    };
			    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
			    lines[lines.length - 1].length === 0 && lines.pop();
			    lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
			        //提取出时间[xx:xx.xx]
			        var time = v.match(pattern),
			            //提取歌词
			            value = v.replace(pattern, '');
			        //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
			        time.forEach(function(v1, i1, a1) {
			            //去掉时间里的中括号得到xx:xx.xx
			            var t = v1.slice(1, -1).split(':');
			            //将结果压入最终数组
			            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
			        });
			    });
			    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
			    result.sort(function(a, b) {
			        return a[0] - b[0];
			    });
			    return result;
				}
	 	}