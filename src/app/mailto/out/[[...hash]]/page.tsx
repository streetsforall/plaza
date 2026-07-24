"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { getEmailTemplate } from "../../helpers/db";
import { geo, districtFinder, geoLoader, combinedGeo } from "../../helpers/geo";
import { textEncoding } from "../../helpers/text_cleanup";
import { addMailchimp } from "../../helpers/mailchimp";
import Footer from "../../components/footer";
import metadata from "../../data/memeber_meta.json";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ hash: string[] }>();
  const hash = params.hash[0];

  const searchParams = useSearchParams();
  const actorEmail = searchParams.get('email');

  // DATA
  const [cta, setCta] = useState<any>();
  const [to, setTo] = useState<any>([]);
  const [locations, setLocations] = useState<any>();
  const [place, setPlace] = useState<any>();
  const [selectedAddress, setSelectedAddress] = useState<any[]>();
  const [generated, setGenerated] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [isFound, setIsFound] = useState(true);

  const [districtInfo, setDistrictInfo] = useState<any>();

  const [status, setStatus] = useState<string>("Waiting for street adrress");
  const [generateToggle, setGenerateToggle] = useState<any>(false);

  // UI
  const [outLink, setOutLink] = useState(false);

  useEffect(() => {
    // need to load in data and email
    const loadEmailTemplate = async () => {
      // Add # symbol back to match DB
      const email_content = await getEmailTemplate(`#${hash}`);
      return email_content;
    };

    function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    loadEmailTemplate()
      .then((result) => {
        if (!result) setIsFound(false);

        setCta(result);
        setTo(result?.to);
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log("to", to);
  }, [to]);

  useEffect(() => {
    // this updates the list of addresses on when the field changes
    const getCoords = async () => {
      var body = {
        string: place,
      };
      const jsonData = await geo(body);
      setLocations(jsonData);
    };

    if (place) {
      getCoords();
    }
  }, [place]);

  const retrieveDistricts = async (address) => {
    setWaiting(true);

    setSelectedAddress(address);
    console.log(address);

    setSelectedAddress(address);
    const merge_fields = {
      ADD_ST: address?.properties?.context?.address?.name || "",
      ADD_CITY: address?.properties?.context?.place?.name || "",
      ADD_ZIP: address?.properties?.context?.postcode?.name || "",
      ADD_STATE: address?.properties?.context?.region?.name || "",
      ADD_COUNTR: address?.properties?.context?.country?.country_code || "",
    };

    if (actorEmail) {
      try {
        addMailchimp(
          decodeURIComponent(decodeURIComponent(actorEmail)), // email from url
          merge_fields
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (address.properties.context.region.name == "California") {
      setLocations([]);

      cta["district_var"].map(async (boundary) => {
        const loadGeo = async () => {
          try {
            // pigeon  coot oystercatcher <
            setStatus(
              "Loading " + boundary + " Districts (might take a few seconds)"
            );

            const coords = [
              address.properties.coordinates.longitude,
              address.properties.coordinates.latitude,
            ];

            const geo_data: any = await combinedGeo(boundary, coords, true);

            setDistrictInfo(geo_data);
            console.log(geo_data);

            setStatus("Finding Address and " + boundary + " District Overlap");

            setTo((prevTo) => [
              geo_data.properties.person.contactDetails[0].value,
              ...prevTo,
            ]);
            // find matching member meta
            const boundaryData = metadata[boundary];

            console.log(boundaryData, boundary);

            var phone = 0;
            // Check if this boundary has the required fields and matching District Number
            const matchingFeature = Object.values(boundaryData).find(
              (feature) =>
                String(feature!["District Number"].toLowerCase()) ===
                String(geo_data.id.toLowerCase())
            );

            setPhoneNum(matchingFeature!["Phone Number"]);

            setOutLink(true);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        await loadGeo();
        setWaiting(false);
        setStatus("Email Updated");
      });
      console.log("to", to);
    } else {
      setWaiting(false);
      setStatus("Sorry, looks like you aren't in California! :'(");
    }
  };

  useEffect(() => {
    // console.log('raw', cta?.subject)
    // console.log('econded', encodeURIComponent(cta?.subject))
    var output = `mailto:${to}?&cc=${cta?.cc}&bcc=${cta?.bcc}&subject=${cta?.subject}&body=${cta?.body}`;

    setGenerated(output);

    console.log("CTA updated");
  }, [to]);

  const renderTextWithLinks = (text) => {
    // Add null/undefined check at the beginning
    if (!text) return "";

    const districtData = {
      district: districtInfo?.id.toUpperCase(),
      legislator: districtInfo?.properties.person.name,
      role: districtInfo?.properties.post.role,
    };

    // First, replace variables with data
    let processedText = text;
    const variableRegex = /\[\[([^\]]+)\]\]/g;

    processedText = processedText.replace(
      variableRegex,
      (match, variableName) => {
        // Return the data value if it exists, otherwise keep the original bracket format
        return districtData[variableName] || match;
      }
    );

    // Then handle URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = processedText.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Clean up the display text by removing protocol and www
        const displayText = part
          .replace(/^https?:\/\//, "") // Remove http:// or https://
          .replace(/^www\./, ""); // Remove www.

        return (
          <a
            key={index}
            href={part} // Keep original URL for the actual link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {displayText}
          </a>
        );
      }
      return part;
    });
  };

  return isFound ? (
    <div className="flex flex-col justify-between min-h-screen">
      <Head>
        <title>{cta?.actionable?.header}</title>
        <meta
          property="og:title"
          content={cta?.actionable?.header}
          key="title"
        />
        <link rel="icon" href="/images/SFA_logo.png" />
      </Head>

      <div className="flex flex-col mx-auto my-4 text-center w-max">
        <a href="https://www.streetsforall.org/">
          <img src="/images/SFA_logo_wide.png" className="max-w-full w-80" />
        </a>
        <label>Mailto ID: {hash}</label>
      </div>

      <div className="bg-white m-auto mt-12 p-4 rounded-2xl text-xl max-w-xl w-[calc(100%-2rem)]">
        <h2 className="font-bold mt-4 mb-8 text-3xl">{cta?.actionable?.header}</h2>

        {(cta?.district_var.length && !outLink) ? (
          <>
            <p>
              Enter your home address below so we can find the right
              representative to contact:
            </p>

            <div>
              <input
                className="text-base md:text-xl w-[calc(100%-1rem)]"
                placeholder="enter address here"
                onChange={(e) => setPlace(e.target.value + ", California")}
              />
              <div>
                {locations
                  ? locations.map((e, i) => {
                      return (
                        <button
                          className="!bg-bg hover:!bg-edit !border-b !border-button px-0 py-2 text-left text-base md:text-lg w-full"
                          data-umami-event="cta_select_address"
                          key={i}
                          onClick={() => retrieveDistricts(e)}
                        >
                          {e.properties.full_address}
                        </button>
                      );
                    })
                  : ""}
              </div>
            </div>

            <label>{status}</label>
            <label>
              {selectedAddress
                ? "Address: " + selectedAddress["properties"].full_address
                : ""}
            </label>
          </>
        ) : (
          <div>
            {/* Legislator info */}
            {districtInfo && (
              <div
               className="border border-dotted border-black mb-8 p-4"
              >
                <span>
                  {`You are represented by ${districtInfo?.properties.post.role} ${
                    districtInfo?.properties.person.name
                  } in district ${districtInfo?.id.toUpperCase()}`}{" "}
                </span>
              </div>
            )}

            {/* Body */}
            {cta?.actionable?.body && (
              <p className="pb-8 text-[#575757] whitespace-pre-wrap">
                {renderTextWithLinks(cta.actionable.body)}
              </p>
            )}

            {/* Phone CTA - requires geographic legislator lookup */}
            {districtInfo && cta?.phone && (
              <div className="relative bg-edit border border-dotted border-black mb-8 p-4">
                <div className="absolute top-0 -left-10 mt-3 -rotate-6 text-5xl">
                  👉
                </div>
                <b>Call your representative: </b>
                <a
                  className="whitespace-nowrap"
                  data-umami-event="cta_click_phone"
                  href={"tel:" + phoneNum}
                >
                  {phoneNum}
                </a>
              </div>
            )}

            {/* Email CTA */}
            <div className="relative bg-edit border border-dotted border-black mb-8 p-4">
              <div className="absolute top-0 -left-10 mt-3 -rotate-6 text-5xl">
                👉
              </div>
              <a href={generated}>
                <button data-umami-event="cta_click_email" className="!bg-[aquamarine] hover:!bg-[rgb(44,168,127)] !border !border-[rgb(44,168,127)] px-3 py-2 rounded-2xl text-xl text-black hover:text-white">
                  <b className="whitespace-nowrap">Email your representative </b>
                  <span className="whitespace-nowrap">(Customize the bottom)</span>
                </button>
              </a>
            </div>

            {/* Mailto link */}
            <div className="border-t border-dotted border-gray-400 mt-4 pt-4 wrap-break-word">
              <label>
                {" "}
                <div onClick={() => setGenerateToggle(!generateToggle)}>
                  {generateToggle ? "▼" : "▶"} Mailto Link
                </div>
                {generateToggle ? (
                  <div className="bg-edit mt-2 p-2 rounded text-xs">{generated}</div>
                ) : (
                  ""
                )}
              </label>
            </div>
          </div>
        )}

        {waiting ? (
          <div className="loader">
            <img src="/images/bus.png" />
            Calculating Your Representative
            <label>(this may take a moment)</label>
          </div>
        ) : (
          ""
        )}
      </div>

      <Footer />
    </div>
  ) : (
    <div className="flex flex-col justify-between h-screen">
      <div className="flex flox-col mx-auto my-4 text-center w-max">
        <a href="https://www.streetsforall.org/">
          <img src="/images/SFA_logo_wide.png" className="max-w-full w-80" />
        </a>
      </div>

      <div className="bg-bg m-auto mt-12 p-4 rounded-2xl text-center text-xl max-w-xl w-[calc(100%-2rem)]">
        <h2>Not Found</h2>

        <p>Sorry, but the page you're looking for doesn't exist.</p>
      </div>

      <Footer />
    </div>
  );
}
