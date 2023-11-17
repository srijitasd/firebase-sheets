const db = require("../db/firestore");
const { sheetsAuth } = require("../middlewares/auth");

const { google } = require("googleapis");
const sheets = google.sheets("v4");

const signupUser = async (req, res) => {
  try {
    const user = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "user_sheet",
      valueInputOption: "USER_ENTERED",
      resource: { values: [[...Object.values(req.body)]] },
      auth: sheetsAuth,
    });

    const id = req.body.email;

    const usersDb = db.collection("users");
    const response = await usersDb.doc(id).set(req.body);

    res.json({ user, response });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const signinUser = async (req, res) => {
  try {
    const user = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "user_sheet",
      auth: sheetsAuth,
    });
    const obj = user.data.values.reduce((o, [a, email, ...v], i) => ((o[email] = i + 1), o), {});

    if (!obj[req.body.email]) {
      res.json({ message: "no user found" });
    } else {
      res.json({ message: "signin successful" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const editUser = async (req, res) => {
  try {
    const data = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "user_sheet",
      auth: sheetsAuth,
    });

    const obj = data.data.values.reduce((o, [a, email, ...v], i) => ((o[email] = i + 1), o), {});

    if (obj[req.body.email]) {
      const user = await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SHEET_ID,
        range: `'user_sheet'!A${obj[req.body.email]}`,
        valueInputOption: "USER_ENTERED",
        resource: { values: [[...Object.values(req.body)]] },
        auth: sheetsAuth,
      });

      const userRef = db.collection("users").doc(req.body.email);
      const firebaseUser = await userRef.update(req.body);

      res.json({ message: "data updated successfully" });
    } else {
      res.json({ message: "no user found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = {
  signupUser,
  signinUser,
  editUser,
};
