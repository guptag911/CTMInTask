import { firebaseAuth, db } from "../config/config";


export const getAnalyticsOverallCompletedData = async () => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        let finalData = [];
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("data")
            .where("status", "==", "resolved")
            .get();
        userRef.forEach((data) => {
            finalData.push(data.data());
        });

        const userRefC = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("confluence")
            .where("status", "==", "complete")
            .get();
        userRefC.forEach((data) => {
            finalData.push(data.data());
        });


        const userRefJ = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("jira")
            .where("status", "==", "complete")
            .get();
        userRefJ.forEach((data) => {
            finalData.push(data.data());
        });


        const userRefH = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("hubspot")
            .collection("data")
            .where("metadata.status", "==", "COMPLETED")
            .get();
        userRefH.forEach((data) => {
            finalData.push(data.data());
        });

        return finalData;
    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsOverallCompletedDataRecently = async (fromDate = (new Date()).getTime() - 7 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        let finalData = [];
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("data")
            .where("status", "==", "resolved")
            .where("modified_time", ">=", fromDate)
            .where("modified_time", "<=", toDate)
            .get();
        userRef.forEach((data) => {
            finalData.push(data.data());
        });

        const userRefC = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("confluence")
            .where("complete_date", ">=", fromDate)
            .where("complete_date", "<=", toDate)
            .get();
        userRefC.forEach((data) => {
            finalData.push(data.data());
        });


        const userRefJ = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("jira")
            .where("complete_date", ">=", fromDate)
            .where("complete_date", "<=", toDate)
            .get();
        userRefJ.forEach((data) => {
            finalData.push(data.data());
        });


        const userRefH = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("hubspot")
            .collection("data")
            .where("metadata.status", "==", "COMPLETED")
            .where("metadata.completionDate", ">=", fromDate)
            .where("metadata.completionDate", "<=", toDate)
            .get();
        userRefH.forEach((data) => {
            finalData.push(data.data());
        });

        return finalData;
    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};



export const getAnalyticsOverallCompletedDataMonth = async (fromDate = (new Date()).getTime() - 30 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        let finalData = [];
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("data")
            .where("status", "==", "resolved")
            .where("modified_time", ">=", fromDate)
            .where("modified_time", "<=", toDate)
            .get();
        userRef.forEach((data) => {
            finalData.push(data.data());
        });

        const userRefC = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("confluence")
            .where("complete_date", ">=", fromDate)
            .where("complete_date", "<=", toDate)
            .get();
        userRefC.forEach((data) => {
            finalData.push(data.data());
        });


        const userRefJ = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("jira")
            .where("complete_date", ">=", fromDate)
            .where("complete_date", "<=", toDate)
            .get();
        userRefJ.forEach((data) => {
            finalData.push(data.data());
        });


        const userRefH = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("hubspot")
            .collection("data")
            .where("metadata.status", "==", "COMPLETED")
            .where("metadata.completionDate", ">=", fromDate)
            .where("metadata.completionDate", "<=", toDate)
            .get();
        userRefH.forEach((data) => {
            finalData.push(data.data());
        });

        return finalData;
    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};





export const getAnalyticsGsuiteData = async (fromDate = (new Date()).getTime() - 7 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("data")
            .where("modified_time", ">=", fromDate)
            .where("modified_time", "<=", toDate)
            .where("status", "==", "resolved")
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            // if (data.data().status === "resolved")
            finalData.push(data.data());
        });
        console.log("Data is in 7 :", finalData);
        return finalData;
    } catch (err) {
        // console.log(JSON.parse(window.sessionStorage.getItem("user")).uid);
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsCompletedGsuiteData = async () => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("data")
            .where("status", "==", "resolved")
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        return finalData;
    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsMonthGsuiteData = async (fromDate = (new Date()).getTime() - 30 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("data")
            .where("modified_time", ">=", fromDate)
            .where("modified_time", "<=", toDate)
            .where("status", "==", "resolved")
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        // console.log("Data is:", finalData);
        return finalData;
    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};





export const getAnalyticsHubspotData = async (fromDate = (new Date()).getTime() - 7 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("hubspot")
            .collection("data")
            .where("metadata.status", "==", "COMPLETED")
            .where("metadata.completionDate", ">=", fromDate)
            .where("metadata.completionDate", "<=", toDate)
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            // if (data.data().metadata.completionDate >= date7DaysBefore)
            finalData.push(data.data());
        });
        return finalData;

    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsCompletedHubspotData = async () => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("hubspot")
            .collection("data")
            .where("metadata.status", "==", "COMPLETED")
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        // console.log("Data is:", finalData);
        return finalData;
    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsMonthHubspotData = async (fromDate = (new Date()).getTime() - 30 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("hubspot")
            .collection("data")
            .where("metadata.status", "==", "COMPLETED")
            .where("metadata.completionDate", ">=", fromDate)
            .where("metadata.completionDate", "<=", toDate)
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            // if (data.data().metadata.completionDate >= date30DaysBefore)
            finalData.push(data.data());
        });
        return finalData;

    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};






export const getAnalyticsJiraData = async (fromDate = (new Date()).getTime() - 7 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("jira")
            .where("complete_date", ">=", fromDate)
            .where("complete_date", "<=", toDate)
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        return finalData;

    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsCompletedJiraData = async () => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("jira")
            .where("status", "==", "complete")
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        // console.log("Data is:", finalData);
        return finalData;
    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsMonthJiraData = async (fromDate = (new Date()).getTime() - 30 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("jira")
            .where("complete_date", ">=", fromDate)
            .where("complete_date", "<=", toDate)
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        return finalData;

    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};



export const getAnalyticsConfData = async (fromDate = (new Date()).getTime() - 7 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("confluence")
            .where("complete_date", ">=", fromDate)
            .where("complete_date", "<=", toDate)
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        return finalData;

    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsCompletedConfData = async () => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("confluence")
            .where("status", "==", "complete")
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        // console.log("Data is:", finalData);
        return finalData;
    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


export const getAnalyticsMonthConfData = async (fromDate = (new Date()).getTime() - 30 * 24 * 3600 * 1000, toDate = (new Date()).getTime()) => {
    try {
        const uid =
            firebaseAuth.currentUser.uid === null
                ? JSON.parse(window.sessionStorage.getItem("user")).uid
                : firebaseAuth.currentUser.uid;
        const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("atlassian")
            .collection("confluence")
            .where("complete_date", ">=", fromDate)
            .where("complete_date", "<=", toDate)
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            finalData.push(data.data());
        });
        return finalData;

    } catch (err) {
        console.log("Error is:", err);
        return [];
    }
};


