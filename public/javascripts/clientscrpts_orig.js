
function changeStyles(status){
	var box = $('a.boxUser');
	
	if(status == 'Busy'){
		box.removeClass('Available');
		box.addClass('Busy');
		box.children('p').eq(1).html('Busy');
		box.data('status', 'Busy');
	}
	else if(status == 'Available'){
		box.removeClass('Busy');
		box.addClass('Available');
		box.children('p').eq(1).html('Available');
		box.data('status', 'Available');
	}
}

function changeStatus(roomNo,status){
	
	var rest_url = '/rooms/'+roomNo+'/'+status;
	
	$.get(rest_url, function(data){
		
		if(data == 'false'){ //false stringi dönmüsse o halde bir islem yapma
			
		}
		else{ // 'Available' ya da 'Busy' seklinde yeni durumlar geliyor. Bunu da changeStyles metoduna gönder
			changeStyles(data);
		}
		
	}, 'text');
	
}


$('a.boxUser').click(function(){
		//var person = prompt("Please enter your name", "Harry Potter");
		var status = $(this).data('status');
		var roomNo = $(this).data('roomno');
		changeStatus(roomNo,status);
	
});

