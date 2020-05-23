import { func, firebaseAuth, db } from "../config/config";

export async function sync() {
  let uid = firebaseAuth.currentUser.uid;
  const syncData = func.httpsCallable("syncData");
  const result = await syncData();
//   const res = await db
//     .collection("users/5A0HzNygT9PtlrwTrggXGoBDDYW2/tasks")
//     .get();
  console.log(result);
}
