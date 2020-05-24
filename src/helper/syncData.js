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
  const res = await db.collection("users/" + uid + "/tasks/gsuite/data").get();
  res.docs.forEach((ele) => {
    console.log(ele.data());
    usersData.push(ele.data());
  });
  const uniqueData = getUniqueData(usersData, "mid");
  console.log(uniqueData);
  return uniqueData;
}

function getUniqueData(arr, comp) {
  // store the comparison  values in array
  const uniqueData = arr
    .map((e) => e[comp])

    // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the false indexes & return unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);

  return uniqueData;
}
