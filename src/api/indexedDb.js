// var request = window.indexedDB.open("firebaseLocalStorageDb", 5);
// request.onerror = function (event) {
//   console.log("indexdb is error ", request);
// };
// request.onsuccess = function (event) {
//   console.log("indexdb is success ", request.result);
//   var db = event.target.result;
//   var transaction = db.transaction(["firebaseLocalStorage"]);
//   var objectStore = transaction.objectStore("firebaseLocalStorage");
//   console.log("objectstore ", objectStore);
//   var request1 = objectStore.get(
//     "firebase:authUser:AIzaSyAaQHOvz_m-PBJa2QFhCuT82aIzFc2ZQVI:[DEFAULT]"
//   );
//   console.log("requests 1 is ", request1);
//   request1.onerror = function (event) {
//     console.log("in error ", request1.result);
//   };
// };
