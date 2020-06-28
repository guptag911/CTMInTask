import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";
import { listUsers } from "../api/directory";

function handleIsSignedIn(isSignedIn) {
  if (isSignedIn) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    const currentUser = auth2.currentUser.get();
    // console.log(currentUser);
    const profile = currentUser.getBasicProfile();
    // console.log("gapi: user signed in!", profile);
    const authResponse = currentUser.getAuthResponse(true);
    const credential = googleProvider.credential(
      authResponse.id_token,
      authResponse.access_token
    );
    firebaseAuth.signInWithCredential(credential).then(({ user }) => {
      // console.log("firebase: user signed in!", {
      //   displayName: user.displayName,
      //   email: user.email,
      //   photoURL: user.photoURL,
      // });

      return user;
    });
  } else {
    console.log("gapi: user is not signed in");
  }
}

new Promise((resolve, reject) => {
  window.gapi.load("client:auth2", () => {
    resolve();
  });
})
  .then(() => {
    console.log("gapi", window.gapi.client);
  })
  .then(() => {
    return window.gapi.client.init({
      clientId: firebaseConfig.clientId,
      scope: firebaseConfig.scopes.join(" "),
      apiKey: firebaseConfig.apiKey,
      discoveryDocs: firebaseConfig.discoveryDocs,
    });
  })
  .then(() => {
    return window.gapi.client.load("analytics", "v3");
  })
  .then(() => {
    console.log("gapi: analytics v3 loaded", window.gapi.client.analytics);
    // listUsers();
  })
  .then(() => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.isSignedIn.listen(handleIsSignedIn);
    handleIsSignedIn(auth2.isSignedIn.get());
  });

export const signIn = async () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
    alert("already signed in");
    return;
  }
  return await auth2.signIn();
};

export const signout = async () => {
  console.log("signing out...");
  firebaseAuth.signOut();
  const auth2 = await window.gapi.auth2.getAuthInstance();
  if (!auth2.isSignedIn.get()) {
    alert("Not signed in!");
    return;
  }
  return await auth2.signOut();
};
