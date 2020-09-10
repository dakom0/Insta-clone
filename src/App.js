import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles, Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import Instaembed from './Instaembed';
import { BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

function App() {
  
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open, setOpen] = React.useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          console.log(authUser)
          setUser(authUser);
        }else{
          // user has logged out
          setUser(null);
        }
      });

        return () =>{
          unsubscribe()
        }
    }, [user, username]);

    useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })
      ));
      console.log(snapshot.docs.map(doc => doc.data().timestamp))
    })
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false)
  }

  const signOut = ((e) =>{
    e.preventDefault();
    auth.signOut()
    setOpen(false)
  })

  const signIn = ((e) =>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  })

  return (

    <div className="app">

      <Modal  
        open={open}
        onClose={()=> setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" action="submit">
            <center>
              <img className="app__headerImage" src="https://fontmeme.com/images/instagram-new-logo.png" alt=""/>
            </center>
            {user ? (
              <Button variant="contained" color="primary" onClick={signOut}>Sign out</Button>
            ): (
              <div className="app__signup">
                <Input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={signUp}>Sign Up</Button>
              </div>
            )}
          </form>
        </div>
      </Modal>

      <Modal  
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" action="submit">
            <center>
              <img className="app__headerImage" src="https://fontmeme.com/images/instagram-new-logo.png" alt=""/>
            </center>
            {user ? (
              <Button variant="contained" color="primary" onClick={signOut}>Sign out</Button>
            ): (
              <div className="app__signup">
                <Input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={signIn}>Sign In</Button>
              </div>
            )}
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://fontmeme.com/images/instagram-new-logo.png" alt=""/>

        {user ? (
         <Button type="submit" className="app__headerButton" onClick={() => setOpen(true)}>Logout</Button>
        ): (
          <div className="app__loginContainer app__headerButton">
            <Button type="submit" className="app__headerButton" onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button type="submit" className="app__headerButton" onClick={() => setOpen(true)}>Sign Up</Button>
          </div>  
        )}
      </div>
      <div className="app__posts">

          <div className="app__postsLeft">
            {
              posts.map(({id, post}) => (
                <Post  key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>

              ))
            }
          </div>

          <div className="app__postsRight">

            <InstagramEmbed
              url='https://instagr.am/p/Zw9o4/'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
      </div>
      {user?.displayName ?
        (<ImageUpload username={user.displayName} />):
        (<h3>Sorry, you need to login to upload an image</h3> )
      }

      <div className="app__footer">
          <div className="app__footerButton">
                <Button type="submit" className="app__footerIcons">
                  <HomeIcon/>
                  <h5>Home</h5> 
                </Button>
                <Button type="submit" className="app__footerIcons"> 
                  <MenuIcon/>
                  <h5>More</h5>
                </Button>
          </div>  
          <img className="app__headerImage" src="https://fontmeme.com/images/instagram-new-logo.png" alt=""/>
      </div>
      </div>
  );
}

export default App;
