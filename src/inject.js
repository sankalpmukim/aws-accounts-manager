function triggerAngularClick() {
  let element = document.getElementById("signin_button");

  console.log("logging");
  // Get the AngularJS scope for the element
  let angularElement = angular.element(element);
  let scope = angularElement.scope();

  // Use AngularJS's $apply to update the view model
  scope.$apply(function () {
    // Access the function and invoke it
    scope.vm.authenticate();
  });
}

// Execute the function
triggerAngularClick();
