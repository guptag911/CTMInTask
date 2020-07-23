This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

# Central Task Manager (InTask)
![logo](https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/zez9iqg8lghajcaq65ai)

# Objective
The objective of Central Task Manager is to increase employee productivity at Innovaccer. Innovaccer currently uses multiple productivity, task/project management tools which helps various departments to document the process and makes sure business objectives are achieved in a productive manner. Due to multiple siloed tools it's difficult for employees to maintain coherence to each tool in day today operations. Central Task Manager will help employees collate task/action items and work breakdowns from various tools and deliver them to employees in a timely and consolidated fashion and will help leadership to monitor capacity and productivity of each employee at Innovaccer.

# Features!

  - All tasks from Google Docs, Sheets and Slides along with tasks from Confluence, Jira and Hubspot.
  - One click acess to go directly to the assigned task.
  - Special filtering of gmail mails based on user predefined star users based on reply priority.
  - Graphical view of completed tasks for user's analysis.
  - Avability of marking the task as star for easier acess to important tasks.
  - Special admin dashboard for the admin to analyze the performance of his/her team or department.
  - Anywhere acess to CTM with chatbot available on Google Chat.

### Tech

CTM InTask used the following tech stack for proper functionininng :
* [ReactJS](https://reactjs.org/) - Used for Fronnt-End UI componenets.
* [NodeJS](https://nodejs.org/) - Used for Backend Event Handling
* [Google Cloud Platorm](https://cloud.google.com/) - Used for Gsuite related sevices integration.
* [JIRA Rest API](https://developer.atlassian.com/server/jira/platform/rest-apis/) - Used for Jira Services integration.
* [Confulence API](https://docs.atlassian.com/atlassian-confluence/REST/6.6.0/) - Used for Confluence Services integration.
* [Hubspot API](https://legacydocs.hubspot.com/docs/overview) - Used for Hubspot Services integration.
* [Firestore](https://firebase.google.com/docs/firestore) - Used for Cloud Database Storage.
* [DialogFlow](https://cloud.google.com/dialogflow/docs) - Used for integration of ChatBot.

### Installation

```sh
$ cd CTMInTask
$ npm install
$ yarn start
```
NOTE: Make sure that you are in master branch.

### How to setup for first time!
    - Login with your innovaccer's account for Gsuite authorization.
    - Use "Identify yourself" on top right to connect your attlassian account with CTM.
    - For connecting with Confluence, navigate to confluence icon and "connect to confluence" to establish a 
      secure connection.
    - Same goes for Jira aswell.
    - Use "Connect to Hubspot"in Hubspot section for connecting Hubspot account to CTM.
    - You are done with all setup and now all your assigned tasks will be always there for you on CTM.

### What can CTM InTask Do!
    1. Gathers all the comments from Google Docs, Sheets and Slides in which the user is tagged i.e an 
       assgined task and shows them in the Gsuite section with function to mark the task as complete, go to 
       task and mark the task as star task.
    2. Assign a priority to the star user's mail available in gmail which you might be intrested in replying.
    3. Shows all your events in the calendar section.
    4. Tasks assigned in Confluence also available with task description, priority and space name along with 
       common CTM features to go to task, star task and mark the task as completed.
    5. Tasks assigned in Jira also available with task description, priority and space name along with 
       common CTM features to go to task, star task and mark the task as completed.
    6. Tasks assigned in Hubspot also available with task description, priority and space name along with 
       common CTM features to go to task, star task and mark the task as completed.
    7. Performs a details analysis on user's performance by analysing the completed and pending tasks on the 
       basis of time.
    8. Anytime acess to CTM tasks with ChatBot for quick response.
    

### Todos
    1. Implement a dumper to delete irrlevant data from  data from database.
    2. A fewer optimizations for faster response.
    3. Chrome Extension to get all features of InTask in Gmail itself.
    4. Improvements in admin dashboard for a detailed analysis of team members.
    5. Some further UI changes for a better user experience.
    6. Integration of assigning Ad-hoc tasks on CTM itself.

License
----

Innovaccer

