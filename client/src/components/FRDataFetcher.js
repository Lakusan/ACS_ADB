import React, { useState, useEffect } from "react";
import axios from "axios";

function FRDataFetcher() {

    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/flights/radar')
            .then( res => {
                console.log(res);
                setPosts(res.data);
            })
            .catch ( err => {
                console.error(err);
            })
    })

    return ( 
        // <div>
        //     <ul>
        //         {
        //             // posts.map(post => <li key={post.id}>{post.title}</li>)
        //         }
        //     </ul>
        // </div>
        "OK"
    )
}

export default FRDataFetcher;