import { googleProvider, firebaseAuth, firebaseConfig, db } from "../config/config";
import axios from "axios";


export const DataSave = async () => {
    try {
        const userRef = await db.collection("users").doc("userID").collection("tasks").add({
            product: "Google Docs",
            completed: false,
            task: "do it",
            url: "task url"
        });
        console.log("userRef is ", userRef);
    }
    catch (e) {
        console.log("error is ", e);
    }
};


export const GetData = async () => {
    window.
    db.collection("users").doc("userID").collection("tasks")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })

} 


export const ListOfLabels = () => {
    console.log("in listlabels is ",window.gapi.client);
    window.gapi.client.gmail.users.messages.list({"userId":"me"})
      .then(function (response) {
        var labels = response.result.labels;
  
        console.log("log lables new ", label);
  
        if (labels && labels.length > 0) {
          for (var i = 0; i < labels.length; i++) {
            var label = labels[i];
            console.log("label is new ",label);
          }
        } else {
          console.log("api error");
        }
      });
  };