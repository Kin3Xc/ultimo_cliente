var app = angular.module('domisilapp.controllers', ['ui.router', 'ngAnimate', 'LocalStorageModule'])


// home '/' controller
app.controller('HomeCtrl', ['$scope', 'localStorageService','Cuenta', '$location', function($scope, localStorageService, Cuenta, $location){
	var local = localStorageService.get('idUser');
	if (local != "") {
		Cuenta.getProfile()
			.success(function(data) {
	          $scope.user = data;
	          // console.log($scope.user[0].usuario);
	        });
	}

	// función que retorna true o false indicando si un usuario esta autenticado o no
	$scope.autenticar = function() {
      return $auth.isAuthenticated();
    };

    // redirige al home de la aplicacion
    $scope.home = function(){
    	$location.url('/home');
    }
}]);

// Creo un controlador para manejar la parte de la cotización del usuario
app.controller('cotizadorController', ['$scope', '$http', 'Compra', '$location', 'geolocation','localStorageService', 'Empresa', 'emp_domiciliarios', function($scope, $http, Compra, $location, geolocation, localStorageService, Empresa, emp_domiciliarios){
	$scope.ver = false;
	geolocation.buscar(); //Invoco la funcion para cargar la api de google maps
		
	//Funcion que se ejecuta al hacer clic en el boton cotizar
	$scope.mostrarInfo = function(){
	  	$scope.ver = true;
	  	var oirigin =null;
	  	var destination = null;

	  	ruta = geolocation.buscar();
	  	console.log(ruta.origin);

	  	//valido que se hayan ingresado los datos de origen y destino
	  	if (ruta.origin == "") {
	  		//si el origen se ingreso a mano, al final de esta le coloco la ciudad y el pais
	  		origin = $scope.origen + ' Bogota, Colombia';
	  	}else{
	  		// si no le asigno el valor que selecciono el usuario
	  		origin = ruta.origin;
	  	}

	  	if (ruta.destination == "") {
	  		destination = $scope.destino + ' Bogota, Colombia';
	  	}else{
	  		destination = ruta.destination;
	  	}
	  	// console.log(origin);
	  	// console.log(destination);

	  	//Preparo un objeto request para calcular la distancia entre el destino y el origen
	  	var request = {
	  		origin: origin,
	  		destination: destination,
	  		travelMode: google.maps.TravelMode.DRIVING,
	  		provideRouteAlternatives:true
	  	};

	  	//ejecuto una funcion que utiliza el api de google maps para calcularme la distancia
		directionsService.route(request, function(response, status){
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				$scope.distancia = response.routes[0].legs[0].distance.value/1000;
				console.log($scope.distancia);
				// var a = Math.round($scope.distancia);
			}else{
				alert('No existen rutas entre ambos puntos');
			}

			//Ejecuto un retardo para que se me cargue la distancia en la vista
			setTimeout(function(){
				$scope.$apply(function(){
					$scope.distancia=$scope.distancia;
				})
			}, 100);
		});


		// SIN PROBAR AUN!!!
		// paso al scope todas las empresas que me trajo el servicio, para poder mostrarlos en la vista
		$scope.empresas = emp_domiciliarios;


	//Funcion para pasar los datos del servicios seleccionado por
	//el usuario a la siguiente vista donde realizará la validación
	$scope.servicioSeleccionado = function (id, valor){
		localStorageService.set('idEmpresa', id);

		// Compra.servicio.empresa = "TUSDOMICILIOS.COM";
		Compra.servicio.valor = valor;
		Compra.servicio.origen = $scope.origen;
		Compra.servicio.destino = $scope.destino;
		Compra.servicio.estado = "En proceso";
		Compra.servicio.tipoPago = $scope.tipoPago;

		$location.url("/service");
	};

}]);
//Fin controlador cotizacion


//Controlador para registrar una nueva empresa al sistema
app.controller('RegistroCtrl',['$scope', '$http', 'emp_domiciliarios', function($scope, $http, emp_domiciliarios){
	$scope.empresa = {};
	$scope.registrarEmpresa = function(){
		console.log($scope.empresa);
		// con el metodo .$add agrego una nueva empresa pasandole como parametro el objeto correspondiente
		// empresas_domiciliarios.$add({$scope.empresa});
		$scope.empresas.$add({$scope.empresa});
	};
}]);
//Fin controller empresa


//Controlador para gestionar toda la parte del servicios hasta el envio del mismo
app.controller('ServiceCrtl', ['$scope', 'Compra', '$location', 'Empresa', function($scope, Compra, $location, Empresa){
	$scope.mostrarLogin = true;

	//Valido que el user este logueado para mostrarle el login y el registro
	// FATA IMPLEMETAR CON FIREBASE
	
	// esta funciona verifica si el usuario esta logueado, retorna false o true según el caso
	// FALTA IMPLEMETAR CON FIREBASE

    //Ejecuto la funcion para que me devuelva los datos de la empresa, y solo muestro el nombre
    // FALTA IMPLEMENTAR CON FIREBASE

	//Cargo los datos del servicio en el scope, para poder verlos en la vista
	$scope.resumen = "Resumen del servicio";
	$scope.valor = Compra.servicio.valor;
	$scope.origen = Compra.servicio.origen;
	$scope.destino = Compra.servicio.destino;

	var vm = this;

	//Funcion para hacer login desde el servicio
	//ESTO DEBE ESTAR EN UNA FUNCION GLOBAL PARA ACCEDERLA DESDE VARIAS PARTES
	this.login = function(){
		// AQUI COIGO PARA LOGUEAR AL USUARIO

	};

	// Funcion para registrarse desde el servicio
	//ESTO DEBE ESTAR EN UNA FUNCION GLOBAL PARA ACCEDERLA DESDE VARIAS PARTES
	$scope.signup = function(){
		// AQUI COIGO PARA REISTRAR AL USUARIO
	};

	//Funcion para validar l opcion de pago del servicio, si todo va bien redirige al resumen del servicios
	//desde donde el usuario podra finalmente comprobar los datos de este y enviarlo
	$scope.validarService = function(){
		console.log('Tipo: '+ $scope.tipoPago);
		Compra.servicio.tipoPago = $scope.tipoPago;
		$location.path('/resumen');
	}

}]);
//Fin controller servicio


//Controlador para mostrar el resumen final del servico
//y enviar el servicio para que sea procesado por la 
//empresa seleccionada
app.controller('ResumenCrtl', ['$scope', 'Compra', '$location', 'Empresa', 'localStorageService', '$http', function($scope, Compra, $location, Empresa, localStorageService, $http){
	//Cargo lel nombre de la empresa, esto deberia estar en un metodo global para no tener que repetirlo
	Empresa.getEmpresa()
	.success(function(data){
		console.log(data[0].nombreEmpresa);
		$scope.empresa= data[0].nombreEmpresa;
		
	});
   
	$scope.titlePage = "Confirmación y envío del servicio";
	$scope.tipoPago = Compra.servicio.tipoPago;
	$scope.origen = Compra.servicio.origen;
	$scope.destino = Compra.servicio.destino;
	$scope.valor = Compra.servicio.valor;
	$scope.estado = Compra.servicio.estado;

	//Preparo el envio del servicio, un objeto con los datos correspondientes esperados por la API
	var myService = {
		userId: localStorageService.get('idUser'),
		tipoDePago: $scope.tipoPago,
		valorPedido: $scope.valor,
		idEmpresa: localStorageService.get('idEmpresa'),
		estadoService: 'Esperando confirmacion',
		dirOrigen: $scope.origen,
		dirDestino: $scope.destino
	}

	//Funcion que se ejecuta al hacer click sobre el boton envar servicio
	// Permite enviar el servicio a la API para que esta lo registre en la base de datos y
	// haga todo el tratamiento correspondiente a la logica del negocio
	$scope.sendService = function(){
		$http.post('AQUI VA LA URL DE FIREBASE/api/service', myService)
		.success(function(data) {
				//$scope.empresa = {}; // Borramos los datos del formulario
				// $scope.empresas = data;
				$scope.respuesta = "Su servicio fuen enviado éxitosamente!";
				console.log('Se guardo esto: '+ myService);
			})
		.error(function(data) {
			$scope.respuesta = "Error en el registro!";
			console.log('Error: ' + data);
		});
	}

	//Funcion que permite imprimir el resumen del servicio
	//EN CONSTRUCCION...
	$scope.print = function(div){
		var printContents = document.getElementById(div).innerHTML;
	  	var popupWin = window.open('', '_blank', 'width=600,height=600');
	  	popupWin.document.open()
	  	popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
	  	popupWin.document.close();
	};
}]);

// para registrar usuarios nuevos al sistema
app.controller('SignUpController', ['$scope', '$location', function($scope, $location){
	var vm = this;
	this.signup = function(){
		// AQUI COIGO PARA REGISTRAR AL USUARIO
	}
}]);

// para ingresar al sistema sesión user
app.controller('LoginController', ['$scope', '$auth', '$location', 'Compra', 'localStorageService', function($scope, $auth, $location, Compra, localStorageService){
	var vm = this;

	this.login = function(){
		// AQUI COIGO PARA LOGUEAR AL USUARIO
	}
}]);

// para cerrar sesión user
app.controller('LogoutController', ['$scope', '$location', 'localStorageService', function($scope, $location, localStorageService){
    //esta funcion permite cerrar la sesion del usuario actual, justo acá elimino 
    // algunos datos del localstorage asociados a ese usuario y finalmente lo redirijo al home

    // CODIGO PASRA DESLOGUEAR AL USUARIO QUE HA HECHO SESIÓN EN EL SISTEMA

}]);
