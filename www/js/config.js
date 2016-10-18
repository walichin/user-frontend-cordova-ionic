angular.module('config', [])

.constant('ENV', {
	name:'development',
	foo:'We are in development!',
	backend:'http://archivoalejos.info:8081/spring-mvc-3-0.0.1-SNAPSHOT'})
	//backend:'http://mobile.archivoalejos.info/spring-mvc-3-0.0.1-SNAPSHOT'})
	//backend:'http://172.16.0.22:8080/spring-mvc-3-context'})

;

