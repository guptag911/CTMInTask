import { func, firebaseAuth } from "../config/config";

export async function sync() {
  let uid = firebaseAuth.currentUser.uid;
  const syncData = func.httpsCallable("syncData");
  const result = await syncData({ uid });
  console.log(result);
}
