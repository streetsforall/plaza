
'use client'

import { useEffect, useState } from "react";
import { getSaved } from "../../helpers/saved_emails";
import { geo, districtFinder, geoLoader } from "../../helpers/geo";
import '../../mailto.css'
import { textEncoding } from "../../helpers/text_cleanup";
import { addMailchimp } from "../../helpers/mailchimp"


export default function Page({ params }: { params: { slug: string } }) {
    // DATA
    const [email, setEmail] = useState<any>();
    const [to, setTo] = useState<any>([])
    const [locations, setLocations] = useState<any>();
    const [place, setPlace] = useState<any>();
    const [selectedAddress, setSelectedAddress] = useState<any[]>();
    const [generated, setGenerated] = useState('')
    const [hash, setHash] = useState('')

    const [status, setStatus] = useState<string>('Waiting for input')

    // UI
    const [outLink, setOutLink] = useState(false)

    useEffect(() => {
        // need to load in data and email
        const loadEmail = async () => {
            const email_content = getSaved(window.location.hash)
            return (email_content)
        }

        setHash(window.location.hash)

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

            console.log(jsonData)

            setLocations(jsonData)
        }

        if (place) { getCoords(); }
    }, [place]);


    const retrieveDistricts = async (address) => {
        console.log(address)

        setSelectedAddress(address)
        console.log('address', address.properties)

        const merge_fields = { 
            ADDRESSYU: {
                addr1: address.properties.context.address.name,
                city: address.properties.context.place.name,
                state: address.properties.context.district.name,
                zip: address.properties.context.postcode.name,
                country: address.properties.context.country.country_code
            }
        }

        console.log('merge_fields', merge_fields)

        if (params.slug) {
            addMailchimp(
                decodeURIComponent(decodeURIComponent(params.slug)), // email from url
                merge_fields
            )
        }


        setLocations([])

        console.log(email.district_var)



        email['district_var'].map(async e => {

            const loadGeo = async () => {
                try {
                    // pigeon  coot oystercatcher <
                    setStatus('Loading ' + e + ' Districts')

                    const data = await geoLoader(e, true);
                    console.log('data', data)

                    setStatus('Finding Address and ' + e + ' District Overlap')

                    const district: any = await districtFinder([address.properties.coordinates.longitude, address.properties.coordinates.latitude], data);

                    setTo([...to, district.contactDetails[0].value])

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

        console.log('raw', email?.subject)
        console.log('econded', encodeURIComponent(email?.subject))
        var output = `mailto:${to}?&cc=${email?.cc}&bcc=${email?.bcc}&subject=${encodeURIComponent(email?.subject)}&body=${(email?.body)}`


        setGenerated(output)

        console.log('email updated')
    }, [to])




    return (

        <div id="outbound">

            <div id="outbound_header">
                <a href="https://www.streetsforall.org/"><img src="/images/SFA_logo_wide.png" /></a>
                <label>Mailto ID: {hash}</label>
            </div>


            <div className="data_field" id="geocoder">

                <p>Enter your address to find your local representative</p>

                <div id="geo_body">
                    <input placeholder="enter address or zip code" onChange={(e) => setPlace(e.target.value)}></input>

                    <div id="dropdown">
                        {locations ? locations.map((e, i) => {
                            return (
                                <button key={i} onClick={() => retrieveDistricts(e)}>{e.properties.full_address}</button>)
                        }) : ''}
                    </div>

                </div>

                <label>{status}</label>
                <br />
                <label>{selectedAddress ? 'Address: ' + selectedAddress['properties'].full_address : ''}</label>
                <br />
                <br />


                <div >{outLink ? <a href={generated}><button id="oubound_copy">Send Email</button></a> : ''}</div>

                {outLink ? <div id="outbound_link"><label >Mailto Link: <div id="outbound_link_text">{generated}</div></label></div> : ''}

            </div>


        </div>

    )

}