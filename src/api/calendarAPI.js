import { firebaseAuth, db } from "../config/config";

var MY_SCHEMA = {
  id: "id of the event",
  creator: "creator mail",
  created_date: "created date",
  start_time: "starting date-time of the event",
  end_time: "ending date-time of the event",
  timezone: "timezone of the event",
  icalUID: "I dont know this field",
  htmlLink: "calender event link",
  status: "event status",
  summary: "event summary, ie basic title",
  location:
    "location of the event, if the meeting is on zoom, this field will contain zoom url",
  organizer: {
    email: "organizer mail",
    displayName: "The name of the organizer for the particular event",
  },
  responded: "whether the user has responded or not",
  updated: "latest modification date-time",
};

export const CalendarDataSave = async (calendar_id) => {
  try {
    let calendarData = await window.gapi.client.calendar.events.list({
      calendarId: calendar_id,
    });

    // console.log(
    //   "calender data is in save ",
    //   calendar_id,
    //   calendarData.result.items
    // );

    calendarData.result.items.forEach(async (element) => {
      if (
        element.status === "confirmed" &&
        element.start.dateTime &&
        new Date(element.start.dateTime).toISOString() >=
          new Date().toISOString()
      ) {
        let loc;
        try {
          loc = element.description.split('href="')[1].split('"')[0];
        } catch (e) {
          loc = null;
        }
        // console.log("loc is ", loc, element);
        let calenderData = {
          id: element.id,
          creator: element.creator.email,
          created_date: element.created,
          start_time: element.start.dateTime,
          end_time: element.end.dateTime,
          timezone: element.end.dateTime ? element.end.dateTime : null,
          icalUID: element.iCalUID,
          htmlLink: element.htmlLink,
          status: element.status,
          summary: element.summary,
          location: element.location ? element.location : loc,
          organizer: {
            email: element.organizer.email,
            displayName: element.organizer.displayName
              ? element.organizer.displayName
              : null,
          },
          updated: element.updated,
        };
        try {
          const uid =
            firebaseAuth.currentUser.uid === null
              ? JSON.parse(window.sessionStorage.getItem("user")).uid
              : firebaseAuth.currentUser.uid;
          const userRef = await db
            .collection("users")
            .doc(uid)
            .collection("calender")
            .doc(element.id)
            .set(calenderData);
          return { msg: "success" };
        } catch (e) {
          console.log("error in the cal is ", e);
          return { msg: false };
        }
      }
    });
  } catch (e) {
    console.log("cal error is ", e);
  }
};

export const CalendarDataGet = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("calender")
      .orderBy("start_time", "asc")
      .get();
    let finalData = [];
    userRef.forEach((data) => {
      if (
        new Date(data.data().start_time).toISOString() >=
        new Date().toISOString()
      ) {
        finalData.push(data.data());
      }
    });
    // console.log("Data is ", finalData);
    return finalData;
  } catch (e) {
    console.log("error is ", e);
    return [];
  }
};

export const get_calendars = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .get();
    let data = userRef.data();
    let email = data.email.toString();
    console.log(email);
    await CalendarDataSave(email);
  }
  catch (err) {
    console.log("Error in fetching calendar list! ", err);
  }
};
