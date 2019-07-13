var app = angular.module('todoApp', []);

app.controller('mainController',function($scope, $http) {
	
  $http.get('api/get/tasks').then(function(tasks) {
  $scope.tasks = tasks;
  //console.log(tasks);
  });
	
  $scope.createTodo = function() {
    //console.log($scope.todo);
    $http.post('api/create/todo', $scope.todo).then(
      function(data) {
        
		$scope.todo = {}; // clear the form so our user is ready to enter another
		$http.get('api/get/tasks').then(function(tasks) {
        $scope.tasks = tasks;
        //console.log(tasks);
        });
      },
      function(error) {
        //error callback
        console.log(error.status);
      }
    );
  };
	
   $scope.deleteTask = function(taskId){
    $http.delete('/api/delete/task/' + taskId).then(
      function() {
        //success callback
        console.log('success');
      },
      function(error) {
        //error callback
        console.log('Error');
      }
    );
  $http.get('api/get/tasks').then(function(tasks) {
  $scope.tasks = tasks;
  //console.log(tasks);
  });
  };
	/*
 // Selected Taskk >>>>>>>>>>>>>>>>>
	$scope.selectedTask = function(taskId){
	console.log("taskId");	
    $http.post('/api/selected/task/' + taskId).then(
      function() {
        //success callback
        //console.log('success');
      },
      function(error) {
        //error callback
        console.log('Error');
      }
    );
 
  };
	*/
 // Assign TTaaaaask >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	/*
  $scope.AssignTask = function() {
    $http.post('api/Assign/task', $scope.Assign).then(
      function(data) {      
      },
      function(error) {
        console.log(error.status);
      }
    );
  };
	*/
	$scope.checkVal = function(){
    $scope.tasks.data.forEach(function(user){
		if(user.selected)
			{
				$http.post('/api/selected/task/' + user.task).then(
					  function() {
						//success callback
						//console.log('success');
					  },
					  function(error) {
						//error callback
						console.log('Error');
					  }
					);
			}
	});
   };
});




 

  
