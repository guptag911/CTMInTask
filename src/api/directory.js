// export async function listUsers() {
//   const results = window.gapi.client.directory.users.list({
//     customer: "innovaccer.com",
//     maxResults: 10,
//     orderBy: "email",
//   });

//   console.log(results);

//   const users = results.result.users;
//   if (users && users.length > 0) {
//     for (let i = 0; i < users.length; i++) {
//       let user = users[i];
//       console.log("-" + user.primaryEmail + " (" + user.name.fullName + ")");
//       return user;
//     }
//   }
// }
