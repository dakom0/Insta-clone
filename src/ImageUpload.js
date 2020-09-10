import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import {storage, db} from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('')
    const time = firebase.firestore.FieldValue.serverTimestamp()

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    };

    const handleUpload = () => {
        
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error message
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image in database
                        db.collection('posts').add({
                            caption: caption,
                            imageUrl: url,
                            username: username,
                            timestamp: time,
                        });
                        setProgress(0);
                        setCaption('')
                        setImage(null)
                    })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input placeholder="Enter a caption..." value={caption} onChange={e => setCaption(e.target.value)} type="text"/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>
                Upload
            </Button>

        </div>
    )
}

export default ImageUpload

