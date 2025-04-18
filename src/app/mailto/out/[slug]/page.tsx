
'use client'

import { useEffect, useState } from "react";
import { getSaved } from "../../helpers/saved_emails";
import { geo, districtFinder, geoLoader, combinedGeo } from "../../helpers/geo";
import '../../mailto.css'
import { textEncoding } from "../../helpers/text_cleanup";
import { addMailchimp } from "../../helpers/mailchimp"
import Footer from "../../components/footer";


export default function Page({ params }: { params: { slug: string } }) {
    // DATA
    const [email, setEmail] = useState<any>();
    const [to, setTo] = useState<any>([])
    const [locations, setLocations] = useState<any>();
    const [place, setPlace] = useState<any>();
    const [selectedAddress, setSelectedAddress] = useState<any[]>();
    const [generated, setGenerated] = useState('')
    const [hash, setHash] = useState('')
    const [slug, setSlug] = useState('')
    const [waiting, setWaiting] = useState(false)

    const [status, setStatus] = useState<string>('Waiting for street adrress')
    const [generateToggle, setGenerateToggle] = useState<any>(false)

    // UI
    const [outLink, setOutLink] = useState(false)

    useEffect(() => {
        // need to load in data and email
        const loadEmail = async () => {
            const email_content = getSaved(window.location.hash)
            return (email_content)
        }

        function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }

        if (validateEmail(params.slug)) { // validate if email
            console.log('valid email')
            setSlug(params.slug)
        } else {
            console.log('invalid email')
            setSlug('')
        }

        setHash(window.location.hash)

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

        setWaiting(true)

        setSelectedAddress(address)

        const merge_fields = {
            ADD_ST: address.properties.context.address.name || "",
            ADD_CITY: address.properties.context.place.name || "",
            ADD_ZIP:address.properties.context.postcode.name || "",
            ADD_STATE: address.properties.context.region.name  || '',
            ADD_COUNTR: address.properties.context.country.country_code || "",
        }

        if (slug) {
            try {
                addMailchimp(
                    decodeURIComponent(decodeURIComponent(slug)), // email from url
                    merge_fields
                )
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }


        if (address.properties.context.region.name == "California") {

            setLocations([])

            email['district_var'].map(async boundary => {
                const loadGeo = async () => {
                    try {

                        // pigeon  coot oystercatcher <
                        setStatus('Loading ' + boundary + ' Districts (might take a few seconds)')

                        const coords = [address.properties.coordinates.longitude, address.properties.coordinates.latitude]

                        const geo_data: any = await combinedGeo(boundary, coords, true);
                        console.log(geo_data)

                        setStatus('Finding Address and ' + boundary + ' District Overlap')


                        setTo([...to, geo_data.contactDetails[0].value])

                        setOutLink(true)

                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }

                };

                await loadGeo()
                setWaiting(false)
                setStatus('Email Updated')
            })
        } else {
            setWaiting(false)
            setStatus("Sorry, looks like you aren't in California! :'(")
        }
    }

    useEffect(() => {

        // console.log('raw', email?.subject)
        // console.log('econded', encodeURIComponent(email?.subject))
        var output = `mailto:${to}?&cc=${email?.cc}&bcc=${email?.bcc}&subject=${(email?.subject)}&body=${(email?.body)}`


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

            <h2 style={{marginBottom: "2rem"}}>{email?.actionable}</h2>

                <p>Enter your home address below so we can find the right representative to email:</p>



                {outLink ? ' ' :
                    <>

                        <div id="geo_body">
                            <input placeholder="enter address here" onChange={(e) => setPlace(e.target.value + ", California")}></input>
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
                    </>
                }

                {waiting ?
                    <div className="loader">
                        <img src="/images/bus.png" />
                        Calculating Your Representative
                        <label>(this may take a moment)</label>
                    </div> : ""}


                <div >{outLink ? <a href={generated}><button id="oubound_copy">Click here to send email</button></a> : ''}</div>

                {outLink ? <div id="outbound_link"><label > <div onClick={() => setGenerateToggle(!generateToggle)}>
                    {generateToggle ? "▼" : "▶"} Mailto Link
                </div>
                    {generateToggle ?
                        <div id="outbound_link_text">
                            {generated}
                        </div>
                        : ""}
                </label></div> : ''}


            </div>

            <Footer />

        </div>

    )

}