import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import "./App.css"

firebase.initializeApp({
 apiKey: "AIzaSyC33VVQMylEyoZPPvn6sE5IW0J54xf5eDg",
  authDomain: "chat-ae5df.firebaseapp.com",
  projectId: "chat-ae5df",
  storageBucket: "chat-ae5df.appspot.com",
  messagingSenderId: "785362854015",
  appId: "1:785362854015:web:63b9a9f3645c0677df9f4a",
  measurementId: "G-B9LVJMCPRY"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign In with Google</button>;
};

const SignOut = () => {
  return auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>;
};

const ChatRoom = () => {

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(155);

  const [message] = useCollectionData(query, { idField: 'id' });

  const [formValue,setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, displayName } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
    })
    setFormValue('')
    
  }


  return (
    <>
      <div>
        {message &&
          message.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>

       <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit">Yuborish</button>
      </form>
    </>
  );
};

function ChatMessage(props) {
  const { text, uid ,displayName, } = props.message;
  const {photoURL,providerData}= auth.currentUser

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='ilr'/>
      <h1>{displayName}</h1> <br/>
      <p className='text-red-500'>{text}</p>

      {
        // providerData?.map((item)=><img src={item.photoURL} alt=''/>)
        console.log(providerData)
      }
    </div>
  )
}



export default App;