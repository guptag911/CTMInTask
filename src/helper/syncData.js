import { func, firebaseAuth, db } from "../config/config";

/*
Schema 
-------
Users(C) -> uid(D) -> tasks(C) -> gsuite(D) -> data(C) -> tasklists(D)
/sample/dgAxdfCJ7bXvHSwooDnQ/tasks/gsuite/data - returns all docs in data collection
*/
const usersData = [];
export async function sync() {
  let uid = firebaseAuth.currentUser.uid;
  const res = await db.collection("sample/" + uid + "/tasks/gsuite/data").get();
  res.docs.forEach((ele) => {
    usersData.push(ele.data());
  });
  console.log(usersData);
  return ;
}
