var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { tile: 'Express' });
});

/*GET Rooms List*/
router.get('/roomlist', function(req, res) {
	var fs = require('fs'),
    xml2js = require('xml2js');
	var parser = new xml2js.Parser();
	
	fs.readFile('C:/Node/exp/3r/public/Rooms.xml', function (err, data) {
		parser.parseString(data,function(err, result){
			console.dir(result);
			console.log('Done');
			res.json(result);
		});
	});
	
});

/*GET room page */
/*router.get('/user', function(req, res, next) {
  res.render('user');
});*/

//send RoomStatus
router.get('/room/:roomNo', function(req, res, next) {
	var fs = require('fs'),
    xml2js = require('xml2js');
	var parser = new xml2js.Parser();
	
	fs.readFile('C:/Node/exp/3r/public/Rooms.xml', function (err, data) {
		//
		parser.parseString(data,function(err, result){
			var Rooms = result.Rooms.Room;
			var status = 'undefined';
			
			Rooms.forEach(function(item){
				if(item.RoomNumber == req.params.roomNo)
					status = item.Status;
			});
			res.render('user', { durum: status, roomNo: req.params.roomNo });
			console.dir(status);
			console.log('Done');
			//res.json(result);
		});
	});
	
});

router.get('/rooms/:roomNo/:status', function(req, res, next){ //parametre olarak roomNo ve Room'a ait o anki durum bilgisi geliyor.
	var fs = require('fs'),
	xml2js = require('xml2js'),
	changed = false,  //xml de değişim oldu mu kontrolü için
	js2xmlparser = require('js2xmlparser');
	var parser = new xml2js.Parser();
	var prm_roomNo = req.params.roomNo; //parametreler
	var prm_status = req.params.status; //parametreler
	
	fs.readFile('C:/Node/exp/3r/public/Rooms.xml', function (err, data) { //xml okuyoruz
	
		parser.parseString(data,function(err, result){ 		//parse edip result obejesine dönüştüyor.
			 
			for(i = 0; i < Object.keys(result.Rooms.Room).length; i++){ // objenin içinde dolaşıyoruz. (roomNo : Status) eşlerinden kaç adet var?
				if(String(result.Rooms.Room[i].RoomNumber) == prm_roomNo){ //Object to String casting. roomNo eşleşiyorsa
					if(result.Rooms.Room[i].Status == prm_status){ //eğer gelen değer ile db deki değer birbirini tutuyorsa içeri gir
						if(prm_status == 'Available'){ 				//gelen Available ise Busy olarak değiştir.
							result.Rooms.Room[i].Status = 'Busy'; 						//düğümü setliyoruz.
							changed = true;
							break;
						}
						else if(prm_status == 'Busy'){		//Busy ise available yap
							result.Rooms.Room[i].Status = 'Available'; 			//düğümü setliyoruz.
							changed = true;
							break;
						}
					}
				}
			}
			
			if(changed){ //eğer değişim olduysa kontrolü, sağlamcılıkla ilgili :)
				var newXml = js2xmlparser("Rooms", result.Rooms);
				fs.writeFile('C:/Node/exp/3r/public/Rooms.xml', newXml, function (err) {
					if(err)
						return console.log(err);
					console.log('Dosya yazıldı');
					
					res.send(prm_status == 'Available' ? 'Busy':'Available'); //Dönüşüm olduğu için parametredekinin tersini yolluyoruz.
				});
			}
			else{ //değişim olmadı
				console.log('Dosya yazılmadı, gelen değer ile db deki durumlar birbirini tutmuyor');
				res.send('false');
			}
			console.log('Done');
		});
	});
	
});

module.exports = router;
