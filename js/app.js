
var app = angular.module('domisilapp', ['domisilapp.controllers', 'domisilapp.services']);

//Configuración de rutas de la aplicacion web
app.config(function($stateProvider, $urlRouterProvider){


	$urlRouterProvider.otherwise('/');

	// defino rutas 
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})

		.state('registro',{
			url: '/registro',
			templateUrl: 'partials/registro.html',
			controller: 'RegistroCtrl'

		})

		.state('service',{
			url: '/service',
			templateUrl: 'partials/service.html',
			controller: 'ServiceCrtl',
			controllerAs: 'login',

		})

		.state('resumen',{
			url:'/resumen',
			templateUrl: 'partials/resumen.html',
			controller: 'ResumenCrtl'
		})

		.state('estado',{
			url: '/estado',
			templateUrl: 'partials/estado.html'
		})

		.state('login', {
			url:'/login',
			templateUrl: 'partials/login.html',
			controller: 'LoginController',
			controllerAs: 'login'
		})

		.state('signup', {
			url: '/signup',
			templateUrl: 'partials/signup.html',
			controller: 'SignUpController',
			controllerAs: 'signup'
		})
		.state('logout', {
			url: '/logout',
			templateUrl: null,
			controller: 'LogoutController'
		});
});

app.set('port', (process.env.PORT || 5000));

















