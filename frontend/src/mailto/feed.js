import React, { useState, useEffect } from 'react';
import './mailto.css';

const Feed = () => {

    const [feed, setFeed] = useState('')

    useEffect(() => {
        loadEmails();
    }, []);

    const loadEmails = async () => {
        const response = await fetch(process.env.REACT_APP_API + 'email/reader');
        const jsonData = await response.json();
        setFeed(jsonData.data.reverse())
        console.log(jsonData.data.reverse())
    }

    return (
        <div id="feeder">

            {feed != '' ? feed.map((mailto) => {

                return (
                    <p>
                        
                        <a href={"/#/mailto/" + mailto.url}>
                        {mailto.time ? new Date(mailto.time).toISOString().slice(0, 10) : ''} • {mailto.subject}
                        </a>
                    </p>
                )
            })

                : ''

            }
        </div>

    )

}

export default Feed;
