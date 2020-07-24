import { firebaseAuth, db } from "../config/config";

export const getIsAdmin = async () => {
  const uid =
  firebaseAuth.currentUser === null || firebaseAuth.currentUser.uid === null
      ? JSON.parse(window.sessionStorage.getItem("user")).uid
      : firebaseAuth.currentUser.uid;

  try{
  const result = await db.collection("users").doc(uid).get();
  console.log(result.data().isAdmin);
  return result.data().isAdmin;
  }
  catch(e){
    console.log("error is ", e);
    return false;
  }
};
