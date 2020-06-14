export const create_tasklist = async () => {
  try {
    let list = {
      title: "Gsuite Tasks",
    };
    let response = await window.gapi.client.tasks.tasklists.insert(list);
    return response.result.id;
  } catch (err) {
    console.log("Error in creating tasklist! ", err);
  }
};

export const get_tasklists = async () => {
  try {
    let response = await window.gapi.client.tasks.tasklists.list();
    let tasklists = response.result.items;
    let tasklist_id = null;
    tasklists.forEach((element) => {
      if (element.title === "Gsuite Tasks") {
        tasklist_id = element.id;
        return;
      }
    });
    if (tasklist_id == null) tasklist_id = await create_tasklist();
    console.log(tasklist_id);
    return tasklist_id;
  } catch (err) {
    console.log("Error in creating tasklist! ", err);
  }
};
