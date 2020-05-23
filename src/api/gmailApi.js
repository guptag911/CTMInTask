import { googleProvider, firebaseAuth, firebaseConfig } from "../config/config";

export const listLabels = () => {
  window.gapi.client.gmail.users.labels
    .list({
      userId: "me",
    })
    .then(function (response) {
      var labels = response.result.labels;

      if (labels && labels.length > 0) {
        for (var i = 0; i < labels.length; i++) { 
          var label = labels[i];
          console.log(label);
        }
      } else {
        console.log("api error");
      }
    });
};
