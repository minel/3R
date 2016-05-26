var pathname = window.location.pathname;
var content = '';
$(document).ready(function(){
	if(pathname == '/'){
		fillRooms();
		setInterval(function(){
			fillRooms();
		},5000);
	}
});



function fillRooms(){
	$.getJSON('/roomlist', function(data){
		var Rooms = data.Rooms.Room;
		var durum = '';
		$.each(Rooms, function(){
			if(this.Status == 'Available')
				durum = this.Status;
			content += '<a href="/room/'+this.RoomNumber+'">'
			content += '<div class="col-md-3 col-sm-4 col-lg-2 col-xs-6">';
			content += '<div class="box '+durum+'">';
			content += this.RoomNumber + '<p>'+this.Status+'</p>';
			content += '</div></div></a>';
			durum = '';
		});
		$('.rooms').html(content);
		content = '';
	});
	
}
