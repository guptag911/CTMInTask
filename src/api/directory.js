// // export async function listUsers() {
// //   const results = window.gapi.client.directory.users.list({
// //     customer: "innovaccer.com",
// //     maxResults: 10,
// //     orderBy: "email",
// //   });

// //   console.log(results);

// //   const users = results.result.users;
// //   if (users && users.length > 0) {
// //     for (let i = 0; i < users.length; i++) {
// //       let user = users[i];
// //       console.log("-" + user.primaryEmail + " (" + user.name.fullName + ")");
// //       return user;
// //     }
// //   }
// // }

// export async function lang() {
//   const text =
//     "What is your name ?";
//   const document = {
//     content: text,
//     type: "PLAIN_TEXT",
//   };

//   // Need to specify an encodingType to receive word offsets
//   const encodingType = "UTF8";

//   const res = await window.gapi.client.language.documents.analyzeSyntax({
//     document,
//     encodingType,
//   });
//   console.log(res);
//   res.result.tokens.forEach((part) => {
//     console.log(`${part.partOfSpeech.mood}: ${part.text.content}`);
//     console.log("Morphology:", part.partOfSpeech);
//   });
// }

// setTimeout(() => {
//   lang();
// }, 5000);
