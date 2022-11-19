import { useState, useContext, useEffect } from 'react'

import './App.css'
import styles from './Style.module.less'
import TodoItem from './components/TodoItem'
import { Context } from './main'
import { doc, deleteDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

function App() {
  const [count, setCount] = useState([{ text: 'Loading...', status: false }])
  const [titleValue, setTitle] = useState(null)
  const [descriptionValue, setDescription] = useState('')
  const [dateValue, setDate] = useState(new Date())
  const [checkboxValue, setChecbox] = useState(false)
  const [fileValue, setFile] = useState('')
  const { firestore } = useContext(Context)

  useEffect(() => {
    getMesForGuest()
  }, []);

  async function getMesForGuest() {
    let subArr = []
    let mes = await getDocs(collection(firestore, 'Todos'))
    mes.forEach((doc) => {
      let objID = { docId: doc.id }
      let subObj = {}
      if(doc.data().date<new Date().toString()&& doc.data().status){
        subObj.status = true
      }
      subArr.push(Object.assign(objID, doc.data(), subObj))
    })
    setCount(subArr)
  }

  async function addNewTodo() {
    try {
      let uniqID = Math.random().toString(36).substring(2)
      const docRef = await addDoc(collection(firestore, "Todos"), {
        text: titleValue,
        description: descriptionValue ? descriptionValue : '',
        date: dateValue.toString(),
        status: checkboxValue,
        file: fileValue ? fileValue.name : '',
        uniqId: uniqID

      });
      console.log("Document written with ID: ", docRef.id);
      if(fileValue){
        sendFile(uniqID)
      }
      
      await getMesForGuest()
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


  let deleteTodo = async (id, filename) => {
    const storage = getStorage();
    const desertRef = ref(storage, filename);
    try {
      await deleteDoc(doc(firestore, "Todos", id));
      if(filename){
        deleteObject(desertRef).then(() => {
        }).catch((error) => {
        });
      }
     
      await getMesForGuest()
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  let updateTodo = async (id, status) => {
    try {
      await updateDoc(doc(firestore, "Todos", id), {
        status: status
      });
      await getMesForGuest()
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function downloadFile(filename) {
    let link = ''
    const storage = getStorage();

    getDownloadURL(ref(storage, filename))
      .then((url) => {

        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      })
      .catch((error) => {
        console.log(error)
      })

  }

  function sendFile(uniqID) {
    const storage = getStorage();
    const storageRef = ref(storage, uniqID + '/' + fileValue.name);

    uploadBytes(storageRef, fileValue).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  }


  return (
    <div className="App">
      <div className={styles.header}>
        <span>TodoItem</span>
      </div>
      <div className={styles.inputAndButton}>
        <div style={{ display: 'flex' }}>
          <input placeholder='Название' type="text" onChange={(e) => setTitle(e.target.value)} value={titleValue} />
          <input type="button" value='+' onClick={() => addNewTodo()} />
          <div className={styles.blockForCheckbox}>
            <span onClick={() => setChecbox(!checkboxValue)} className={[styles.checkMark, checkboxValue && styles.actived].join(' ')}></span>
            <input type="checkbox" />
          </div>
        </div>
        <div style={{ display: 'flex', margin: ' 10px 0' }}>
          <input placeholder='Описание' type="text" onChange={(e) => setDescription(e.target.value)} value={descriptionValue} />
          <label for="file">
          <span>Файл</span>
          <input id='file' onChange={(e) => setFile(e.target.files[0])} type="file" />
          </label>
          

        </div>
        <div style={{ display: 'flex' }}>
          <input step="1" type="datetime-local" onChange={(e) => setDate(new Date(e.target.value))} />
  

        </div>
        <div>
          {fileValue.name}
        </div>
        <div>


        </div>


      </div>
      <div className={styles.list}>
        {count.map(x => {
          return (
            <TodoItem key={x.docId} id={x.docId} text={x.text} status={x.status} deleteTodo={deleteTodo} updateTodo={updateTodo}
              file={x.file} downloadFile={downloadFile} uniqId={x.uniqId} description={x.description} date={x.date}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App
