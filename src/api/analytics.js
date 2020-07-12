import { firebaseAuth, db } from "../config/config";

export const getAnalyticsGsuiteData = async () => {
    try {
        let date7DaysBefore = (new Date()).getTime() - 7 * 24 * 3600 * 1000;
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
            .where("modified_time", ">=", date7DaysBefore)
            .get();
        let finalData = [];
        userRef.forEach((data) => {
            if (data.data().status === "resolved")
                finalData.push(data.data());
        });
        // console.log("Data is:", finalData);
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



export const getAnalyticsHubspotData = async () => {
    try {
        let date7DaysBefore = (new Date()).getTime() - 7 * 24 * 3600 * 1000;
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
            if (data.data().metadata.completionDate >= date7DaysBefore)
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
