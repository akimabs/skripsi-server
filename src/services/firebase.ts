import firebaseAdmin from "firebase-admin";
import path from "path";

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    path.join(__dirname, "./privatekeynotif.json")
  ),
});

export default firebaseAdmin;
