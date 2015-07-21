var app = angular.module('domisilapp.services', ['LocalStorageModule'])

//Esta factoria retonrna cada una de las empresas registradas en la base de datos FIREBASE
app.factory('emp_domiciliarios', function($firebaseArray){
	 var empresas_domiciliarios = new Firebase("https://myapp.firebaseio.com/emp-domiciliarios");
  	return $firebaseArray(empresas_domiciliarios);
});

//Esta factoria retonrna todos los usuarios registradas en la base de datos FIREBASE
app.factory('usuarios', function($firebaseArray){
	 var usuarios = new Firebase("https://myapp.firebaseio.com/users");
  	return $firebaseArray(usuarios);
});

//Servicio para consultar los datos de un usuario en especifico, pasandole como parametro
// su id, la api retornara tdos los datos asociados a ese id
app.factory('Cuenta', function($http, localStorageService) {
    return {
      getProfile: function() {
      	var id = localStorageService.get('idUser');
        return $http.get('AQUI VA LA URL DE FIREBASE/api/users/'+id);
      }
    };
});

//Esta factorya permite hacer una peticion get a la API para que me retorne los datos
// de una empresa, para eso es necesario pasarle el id de la empresa que deseamos consultar
app.factory('Empresa', function($http, localStorageService) {
    return {
      getEmpresa: function() {
      	var id = localStorageService.get('idEmpresa');
        return $http.get('AQUI VA LA URL DE FIREBASE/api/emp-domiciliarios/'+id);
      }
    };
});

//Servicio que es inyectado en varios controladores para
//poder tener acceso a los datos en diferentes vistas
app.factory("Compra", function() {
  return {
    servicio: {}
  };
});

//Servicio utilizado para consumir el API de google maps
app.factory('geolocation', function(){
	service = {};

	var originLatLon="";
	var destinyLatLon="";

	//Esta funcion mustras las posibles opciones al momento de ingresar una direccion
	// y retorna los las coordenadas para que posteriormente se pueda calcular la distancia entre estas
	service.buscar = function(){
		directionsService = new google.maps.DirectionsService();
		directionsDisplay = new google.maps.DirectionsRenderer();

		var options = {
		  componentRestrictions: {country: 'CO'}
		};

		var Origen = new google.maps.places.Autocomplete((document.getElementById('origen')),options);
		google.maps.event.addListener(Origen, 'place_changed', function() {
			var place = Origen.getPlace();
			originLatLon = place.geometry.location;
			console.log(originLatLon);
		});

		var Destino = new google.maps.places.Autocomplete((document.getElementById('destino')),options);
		google.maps.event.addListener(Destino, 'place_changed', function() {
			var place = Destino.getPlace();
			destinyLatLon = place.geometry.location;
			console.log(destinyLatLon);
		});
		return {origin:originLatLon, destination:destinyLatLon}
	}
	return service;
});
