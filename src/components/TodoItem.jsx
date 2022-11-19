import styles from '../Style.module.less'
import { useState, useContext } from 'react'
import { Context } from '../main'
import { doc,deleteDoc , setDoc, getDocs, updateDoc, deleteField, collection, query, addDoc } from "firebase/firestore";

export default function TodoItem(props){
    const [isHover, setHover] = useState(false)
    const [isOpen, setOpen] = useState(false)
    const { firestore } = useContext(Context)
 
    return (
        <div  onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} className={styles.todoItem}>
            <span>{props.text} {(props.file||props.description||props.date) &&<span onClick={()=>setOpen(!isOpen)} className={styles.eye}></span>}</span>
            <span onClick={()=>props.updateTodo(props.id, !props.status)} className={ [styles.checkMark,  props.status && styles.actived].join(' ')}></span>
            {isHover&&<span onClick={()=>{props.deleteTodo(props.id, props.uniqId+'/'+ props.file)}} className={ styles.deleteMark}></span>}
            <input type="checkbox" checked={props.status} />
            {isOpen&&props.description&&<span className={styles.description}>{props.description}</span>}
            {isOpen&&props.date&&<span className={styles.description}>{props.date }</span>}
            {isOpen&&props.file&&<span className={styles.link} onClick={()=>props.downloadFile(props.uniqId+'/'+ props.file)}>{props.file}</span>}
          </div>
    )
}