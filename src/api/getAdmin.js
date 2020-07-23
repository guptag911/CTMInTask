import { firebaseAuth, db } from "../config/config";

export const getIsAdmin = async () => {
  const uid =
    firebaseAuth.currentUser.uid === null
      ? JSON.parse(window.sessionStorage.getItem("user")).uid
      : firebaseAuth.currentUser.uid;

  const result = await db.collection("users").doc(uid).get();
  console.log(result.data().isAdmin);
  return result.data().isAdmin;
};
