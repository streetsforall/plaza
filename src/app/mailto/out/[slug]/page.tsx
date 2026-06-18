"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { getEmailTemplate } from "../../helpers/db";
import { geo, districtFinder, geoLoader, combinedGeo } from "../../helpers/geo";
import { textEncoding } from "../../helpers/text_cleanup";
import { addMailchimp } from "../../helpers/mailchimp";
import Footer from "../../components/footer";
import metadata from "../../data/memeber_meta.json";
import "../../mailto.css";

export default function Page({ params }: { params: { slug: string } }) {
  // DATA
  const [email, setEmail] = useState<any>();
  const [to, setTo] = useState<any>([]);
  const [locations, setLocations] = useState<any>();
  const [place, setPlace] = useState<any>();
  const [selectedAddress, setSelectedAddress] = useState<any[]>();
  const [generated, setGenerated] = useState("");
  const [hash, setHash] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [slug, setSlug] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [isFound, setIsFound] = useState(true);

  const [districtInfo, setDistrictInfo] = useState<any>();

  const [status, setStatus] = useState<string>("Waiting for street adrress");
  const [generateToggle, setGenerateToggle] = useState<any>(false);

  // UI
  const [outLink, setOutLink] = useState(false);

  useEffect(() => {
    // need to load in data and email
    const loadEmail = async () => {
      const email_content = await getEmailTemplate(window.location.hash);
      return email_content;
    };

    function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    if (validateEmail(params.slug)) {
      // validate if email
      console.log("valid email");
      setSlug(params.slug);
    } else {
      console.log("invalid email");
      setSlug("");
    }

    setHash(window.location.hash);

    loadEmail()
      .then((result) => {
        if (!result) setIsFound(false);

        setEmail(result);
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

    if (slug) {
      try {
        addMailchimp(
          decodeURIComponent(decodeURIComponent(slug)), // email from url
          merge_fields
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (address.properties.context.region.name == "California") {
      setLocations([]);

      email["district_var"].map(async (boundary) => {
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
    // console.log('raw', email?.subject)
    // console.log('econded', encodeURIComponent(email?.subject))
    var output = `mailto:${to}?&cc=${email?.cc}&bcc=${email?.bcc}&subject=${email?.subject}&body=${email?.body}`;

    setGenerated(output);

    console.log("email updated");
  }, [to]);

  const renderTextWithLinks = (text) => {
    // Add null/undefined check at the beginning
    if (!text) return "";

    const districtData = {
      district: districtInfo.id.toUpperCase(),
      legislator: districtInfo.properties.person.name,
      role: districtInfo.properties.post.role,
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
    <div id="outbound">
      <Head>
        <title>{email?.actionable?.header}</title>
        <meta
          property="og:title"
          content={email?.actionable?.header}
          key="title"
        />
        <link rel="icon" href="/images/SFA_logo.png" />
      </Head>

      <div id="outbound_header">
        <a href="https://www.streetsforall.org/">
          <img src="/images/SFA_logo_wide.png" />
        </a>
        <label>Mailto ID: {hash}</label>
      </div>

      <div className="data_field" id="geocoder">
        <h2 style={{ marginBottom: "2rem" }}>{email?.actionable?.header}</h2>

        {outLink ? (
          <div
            style={{
              marginBottom: "2rem",
              border: "1px dotted black",
              padding: "1rem",
            }}
          >
            <span>
              {`You are represented by ${districtInfo?.properties.post.role} ${
                districtInfo?.properties.person.name
              } in district ${districtInfo?.id.toUpperCase()}`}{" "}
            </span>
          </div>
        ) : (
          ""
        )}

        {outLink ? (
          <p
            style={{
              paddingBottom: "2rem",
              color: "#575757",
              whiteSpace: "pre-wrap",
            }}
          >
            {email?.actionable?.body
              ? renderTextWithLinks(email.actionable.body)
              : ""}
          </p>
        ) : (
          ""
        )}

        {!outLink ? (
          <p>
            Enter your home address below so we can find the right
            representative to contact:
          </p>
        ) : (
          ""
        )}

        {outLink ? (
          " "
        ) : (
          <>
            <div id="geo_body">
              <input
                placeholder="enter address here"
                onChange={(e) => setPlace(e.target.value + ", California")}
              ></input>
              <div id="dropdown">
                {locations
                  ? locations.map((e, i) => {
                      return (
                        <button
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

        <div>
          {outLink ? (
            <div className="cta_box">
              <div
                className="cta_pointer"
              >
                👉
              </div>
              <b>Call your representative: </b>
              <a
                style={{ whiteSpace: "nowrap" }}
                data-umami-event="cta_click_phone"
                href={"tel:" + phoneNum}
              >
                {phoneNum}
              </a>
            </div>
          ) : (
            ""
          )}

          {outLink ? (
            <div className="cta_box">
              <div
                className="cta_pointer"
              >
                👉
              </div>
              <a href={generated}>
                <button data-umami-event="cta_click_email" id="oubound_copy">
                  <b style={{ whiteSpace: "nowrap" }}>Email your representative </b>  <> </>
                  <span style={{ whiteSpace: "nowrap" }}>(Customize the bottom)</span>
                </button>
              </a>
            </div>
          ) : (
            ""
          )}
        </div>

        {outLink ? (
          <div id="outbound_link">
            <label>
              {" "}
              <div onClick={() => setGenerateToggle(!generateToggle)}>
                {generateToggle ? "▼" : "▶"} Mailto Link
              </div>
              {generateToggle ? (
                <div id="outbound_link_text">{generated}</div>
              ) : (
                ""
              )}
            </label>
          </div>
        ) : (
          ""
        )}
      </div>

      <Footer />
    </div>
  ) : (
    <div id="outbound">
      <div id="outbound_header">
        <a href="https://www.streetsforall.org/">
          <img src="/images/SFA_logo_wide.png" />
        </a>
      </div>

      <div className="data_field" id="geocoder" style={{ textAlign: "center" }}>
        <h2>Not Found</h2>

        <p>Sorry, but the page you're looking doesn't exist.</p>
      </div>

      <Footer />
    </div>
  );
}
