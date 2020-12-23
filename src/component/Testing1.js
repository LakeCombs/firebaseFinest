import React from "react";
import { app } from "../base";
import { v4 as uuidv4 } from "uuid";

const db = app.firestore().collection("student");
function Testing1() {
  const [name, setName] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [fileUrl, setFileUrl] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [done, setDone] = React.useState(false);

  const imageUpload = async (e) => {
    const file = e.target.files[0];
    const storeRef = app.storage().ref();
    const fileRef = storeRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  };

  const fileUpload = async () => {
    // const x = uuidv4();
    await db.doc().set({
      date: Date.now(),
      name,
      position,
      avatar: await fileUrl,
      id: uuidv4(),
      status: done,
    });
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to do this?")) {
      await db.doc(id).delete();
    }
    console.log(id);
  };

  const editData = async (id) => {
    const newPosition = prompt();
    await db.doc(id).update({ position: newPosition });

    console.log(id);
  };

  const editStatus = async (id) => {
    // const newPosition = prompt();
    await db.doc(id).update({ status: done });
    console.log(id);

    // console.log(id);
  };

  const getData = async () => {
    await db
      .orderBy("date", "desc")
      // .limit(2)
      .onSnapshot((snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id });
        });
        setData(items);
      });
  };
  console.log(data);
  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <center style={{ width: "300px" }}>
        <section style={{ display: "flex", flexDirection: "column" }}>
          <input type="file" onChange={imageUpload} />
          <aside>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              placeholder="Position"
              value={position}
              onChange={(e) => {
                setPosition(e.target.value);
              }}
            />
            <button onClick={fileUpload}>Add</button>
          </aside>
        </section>
      </center>

      <section>
        {data.map(({ name, avatar, position, id, status }) => (
          <aside key={id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setDone(!done);
                  editStatus(id);
                }}
              >
                {" "}
                {status === true ? "👍" : "👎 "}{" "}
              </div>
              <div>{name}</div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onDelete(id);
                  // console.log(id);
                }}
              >
                ❌{" "}
              </div>
            </div>
            <img
              src={avatar}
              alt={name}
              style={{ width: "300px", height: "200px", objectFit: "cover" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{position}</div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  // console.log(id);
                  editData(id);
                }}
              >
                {" "}
                🧾{" "}
              </div>
            </div>
          </aside>
        ))}
      </section>
    </div>
  );
}

export default Testing1;
