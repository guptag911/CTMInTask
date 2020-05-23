import { googleProvider, firebaseAuth, firebaseConfig } from "../config/config";

export const ListLabels = () => {
  console.log("in listlabels ",window.gapi.client);
  window.gapi.client.gmail.users.labels
    .list({
      userId: "me",
    })
    .then(function (response) {
      var labels = response.result.labels;

      console.log("log lables is ", label);

      if (labels && labels.length > 0) {
        for (var i = 0; i < labels.length; i++) { 
          var label = labels[i];
          console.log("label is ",label);
        }
      } else {
        console.log("api error");
      }
    });
};
