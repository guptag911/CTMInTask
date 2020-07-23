import { firebaseAuth, db } from "../config/config";

export const getIsAdmin = async () => {
  const uid =
    !firebaseAuth.currentUser || firebaseAuth.currentUser.uid === null
      ? JSON.parse(window.sessionStorage.getItem("user")).uid
      : firebaseAuth.currentUser.uid;
    db.collection("users")
    .doc(uid)
    .get().then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        return doc.data().isAdmin
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return false;
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
      return false;
    });

};
