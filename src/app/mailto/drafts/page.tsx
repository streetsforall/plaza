'use client'

import React, { useState, useEffect } from 'react';
import {getAllSaved} from '../helpers/saved_emails'
import './../mailto.css';

const Feed = () => {

    const [feed, setFeed] = useState<any[]>([])

    useEffect(() => {

        const loadEmails = async () => {
            const response = getAllSaved();
            console.log('response', response)
            return(response)
        }


        loadEmails().then(result => {
            console.log('result', result[0]) 
            setFeed(result[0].data)
        }).catch(err => {
            console.log(err)
        })

    
    
    }, []);
    
    return (
        <div id="feeder">

            {feed ? feed.map((mailto) => {

                return (
                    <p>
                        <a href={"/mailto" + mailto.url}>
                        {mailto.time ? new Date(mailto.time).toISOString().slice(0, 10) : ''} • {decodeURIComponent(mailto.subject)}
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
