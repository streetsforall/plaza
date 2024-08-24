
'use client'

import { useEffect, useState } from "react";
import { getSaved } from "../../helpers/saved_emails";
import { geo, districtFinder, geoLoader } from "../../helpers/geo";
import '../../mailto.css'


export default function Page({ params }: { params: { slug: string } }) {
    // DATA
    const [email, setEmail] = useState<any>();
    const [to, setTo] = useState<any>([])
    const [locations, setLocations] = useState<any>();
    const [place, setPlace] = useState<any>();
    const [selectedAddress, setSelectedAddress] = useState<any[]>();
    const [generated, setGenerated] = useState('')

    const [status, setStatus] = useState<string>('Waiting for input')

    // UI
    const [outLink, setOutLink] = useState(false)

    useEffect(() => {
        // need to load in data and email
        const loadEmail = async () => {
            const email_content = getSaved(window.location.hash)
            return (email_content)
        }

        console.log(params.slug)

        loadEmail().then(result => {
            setEmail(result)
            setTo(result.to)
            console.log(result)
        }).catch(err => {
            console.log(err)
        })

    }, []);

    useEffect(() => {
        // this updates the list of addresses on when the field changes
        const getCoords = async () => {
            var body = {
                string: place
            }
            const jsonData = await geo(body);
            setLocations(jsonData)
        }

        if (place) { getCoords(); }
    }, [place]);


    const retrieveDistricts = async (address) => {
        console.log(address)

        setSelectedAddress(address)

        setLocations([])

        console.log(email.district_var)



        email['district_var'].map(async e => {

            const loadGeo = async () => {
                try {
                    // pigeon  coot oystercatcher <
                    setStatus('Loading '+ e + ' Districts')

                    const data = await geoLoader(e, true);
                    console.log('data', data)

                    setStatus('Finding Address and ' + e + ' District Overlap')

                    const district : any = await districtFinder(address.center, data);
                    console.log('districts', district)

                    console.log(district.contactDetails[0].value)

                    setTo([...to, district.contactDetails[0].value])   
                    
                    console.log('to address', to)
                    

                    setOutLink(true)
                    
                } catch (error) {
                    console.error('Error fetching data:', error);
                }

            };

            await loadGeo()
            setStatus('Email Updated')
        })

        console.log(email)
    }

    useEffect(() => {
        function spaced(text) {
            if (text) {
                var spacer = encodeURI(text.trim())
                return (spacer)
            }
        }

        var output = `mailto:${to}?&cc=${email?.cc}&bcc=${email?.bcc}&subject=${spaced(email?.subject)}&body=${spaced(email?.body)}`
        
        
        setGenerated(output)

        console.log('email updated')
    }, [to])




    return (

        <div id="outbound">

            <div id="outbound_header">
                <a href="https://www.streetsforall.org/"><img src="/images/SFA_logo_wide.png" /></a>
                <label>Mailto ID: {window.location.hash}</label>
            </div>


            <div className="data_field" id="geocoder">

                <p>Enter your address to find your local representative</p>

                <div id="geo_body">
                    <input placeholder="enter address or zip code" onChange={(e) => setPlace(e.target.value)}></input>

                    <div id="dropdown">
                        {locations ? locations.map((e, i) => {
                            return (
                                <button key={i} onClick={() => retrieveDistricts(e)}>{e.place_name}</button>)
                        }) : ''}
                    </div>

                </div>

                <label>{status}</label>
<br/>
                <label>{selectedAddress ? 'Address: '+ selectedAddress['place_name'] : ''}</label>
                <br/>
                <br/>
            

                <div >{outLink ? <a href={generated}><button id="oubound_copy">Send Email</button></a> : ''}</div>

                {outLink ? <div id="outbound_link"><label >Mailto Link: <div id="outbound_link_text">{generated}</div></label></div> : ''}

            </div>


        </div>

    )

}