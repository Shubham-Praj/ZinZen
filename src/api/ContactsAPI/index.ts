/* eslint-disable arrow-body-style */
import { db } from "@models";
import ContactItem from "@src/models/ContactItem";
import { GoalItem } from "@src/models/GoalItem";
import { getJustDate } from "@src/utils";
import { v4 as uuidv4 } from "uuid";

const createRequest = async (url: string, body : object | null = null, method = "POST") => {
  try {
    const res = await fetch(url, {
      method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {})
    });
    return { success: res.ok, response: await res.json() };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
};
export const initRelationship = async () => {
  const installId = localStorage.getItem("installId");
  const url = "https://7i76q5jdugdvmk7fycy3owyxce0wdlqv.lambda-url.eu-west-1.on.aws/";

  const res = await createRequest(url, { method: "initiateRelationship", installId });
  if (res.success) {
    const { relId } = res.response;
    return { success: true, response: { installId, relId } };
  }
  return res;
};

export const acceptRelationship = async () => {
  const relId = window.location.pathname.split("/invite/")[1];
  const installId = localStorage.getItem("installId");
  const url = "https://7i76q5jdugdvmk7fycy3owyxce0wdlqv.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "acceptRelationship", installId, relId });
  return res;
};

export const shareGoalWithContact = async (relId: string, goal: { id: string, title: string }) => {
  const installId = localStorage.getItem("installId");
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "shareGoal", installId, relId, goal });
  return res;
};

export const getContactSharedGoals = async () => {
  const installId = localStorage.getItem("installId");
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "getGoals", installId });
  return res;
};

export const getAllContacts = async () => {
  const allContacts = await db.contactsCollection.toArray();
  return allContacts;
};

export const addContact = async (contactName: string, relId: string) => {
  const name = `${contactName.charAt(0).toUpperCase() + contactName.slice(1)}`;
  const currentDate = getJustDate(new Date());
  const newContact: ContactItem = { name, relId, goals: [], createdAt: currentDate };
  let newContactId;
  await db
    .transaction("rw", db.contactsCollection, async () => {
      newContactId = await db.contactsCollection.add(newContact);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newContactId;
};

export const getContactByRelId = async (relId: string) => {
  try {
    const contact = await db.contactsCollection.where("relId").equals(relId).toArray();
    return contact[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getContactGoalById = async (id: string) => {
  const goal = await db.contactsCollection.where("id").equals(id).toArray();
  return goal[0];
};

export const addGoalInRelId = async (relId: string, goals:{ id: string, goal: GoalItem }[]) => {
  db.transaction("rw", db.contactsCollection, async () => {
    await db.contactsCollection.where("relId").equals(relId)
      .modify({ goals: [...goals] });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getAllSharedGoals = async () => {
  const contacts = await db.contactsCollection.toArray();
  return contacts;
};