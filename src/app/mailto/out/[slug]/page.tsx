
'use client'

import { useEffect, useState } from "react";
import { getSaved } from "../../helpers/saved_emails";
import { geo, districtFinder } from "../../helpers/geo";


// import districts
import assemblies from "../../data/CA_Assembly_Districts.json";
import senates from "../../data/CA_Senate_Districts.json";


export default function Page({ params }: { params: { slug: string } }) {
    // DATA
    const [email, setEmail] = useState<any>();
    const [to, setTo] = useState<any>()
    const [locations, setLocations] = useState<any>();
    const [place, setPlace] = useState<any>();
    const [selectedAddress, setSelectedAddress] = useState<any[]>();
    const [assembly, setAssembly] = useState()
    const [senate, setSenate] = useState()
    const [generated, setGenerated] = useState('')

    // UI
    const [outLink, setOutLink] = useState(false)

    useEffect(() => {

        const loadEmail = async () => {
            const email_content = getSaved(window.location.hash)
            return (email_content)
        }

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
            if (e == 'Assembly') {
                const asemb: any = await districtFinder(address.center, assemblies)

                setTo([...to, asemb.DEMAIL])


                console.log(asemb)
                setAssembly(asemb)
            }

            if (e == 'Senate') {
                const sent : any = await districtFinder(address.center, assemblies)
                setTo([...to, sent.DEMAIL])
                console.log(sent)
                setSenate(sent)
            }

            console.log(e)
        })
        
        setOutLink(true)

        console.log(email)

        // console.log(senate, assembly)
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

        console.log(output)
    }, [to])




    return (

        <div>

            My Post: {params.slug + window.location.hash}



            <div className="data_field" id="geocoder">

                <label >Enter your address to find your local representative</label>

                <div id="geo_body">
                    <input onChange={(e) => setPlace(e.target.value)}></input>

                    <div id="dropdown">
                        {locations ? locations.map(e => {
                            return (
                                <button onClick={() => retrieveDistricts(e)}>{e.place_name}</button>)
                        }) : ''}
                    </div>

                </div>

                {outLink ? <p>Address: {selectedAddress ? selectedAddress['place_name'] : ''}</p> : ''}
                {outLink ? <p>Representatives: {senate}{assembly}</p> : ''}

                {outLink ? <a href={generated}><button>Send Email</button></a> : ''}

            </div>


        </div>

    )

}