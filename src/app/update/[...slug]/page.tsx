"use client";

import { useEffect, useState } from "react";
import "../../mailto/mailto.css";
import "./update.css";
import Head from "next/head";
import { geo } from "../../mailto/helpers/geo";
import { textEncoding } from "../../mailto/helpers/text_cleanup";
import { addMailchimp } from "../../mailto/helpers/mailchimp";
import Footer from "../../mailto/components/footer";

export default function Page({ params }: { params: { slug: string } }) {
  // DATA
  const [email, setEmail] = useState<any>();
  const [place, setPlace] = useState<any>();
  const [locations, setLocations] = useState<any>();
  const [slug, setSlug] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<any[]>();
  const [waiting, setWaiting] = useState(false);

  // Set the initial slug value directly
  useEffect(() => {
    function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    console.log("initial slug", params.slug.toString());
    if (params.slug) {
      setSlug(decodeURIComponent(decodeURIComponent(params.slug.toString())));
    }
  }, []);

  useEffect(() => {
    console.log(slug);
  }, [slug]);

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

    const merge_fields = {
      ADD_ST: address.properties.context.address.name || "",
      ADD_CITY: address.properties.context.place.name || "",
      ADD_ZIP: address.properties.context.postcode.name || "",
      ADD_STATE: address.properties.context.region.name || "",
      ADD_COUNTR: address.properties.context.country.country_code || "",
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
  };

  return (
    <>
      <Head>
                <script src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js" />
        <link
          href="//cdn-images.mailchimp.com/embedcode/classic-061523.css"
          rel="stylesheet"
          type="text/css"
        ></link>
      </Head>
      <div id="outbound">
        <div id="outbound_header">
          <a href="https://www.streetsforall.org/">
            <img src="/images/SFA_logo_wide.png" />
          </a>
          Email Update Tool
        </div>

        <div className="data_field" id="geocoder">
          <h2>Update your Streets for All contact information</h2>
          <label className="intro">
            We ask for your address to make sure you only get calls to action
            relevant to your area. Even a zip code helps. This keeps spam out of your inbox and helps
            our work be as effective as it can be. We will never distribute your
            personal information. 
          </label>

          {/* AUTO ADDRESS */}
          {/* 
          <div id="geo_body">
            <input
              placeholder="enter address here"
              onChange={(e) => setPlace(e.target.value + ", California")}
            ></input>
            <div id="dropdown">
              {locations
                ? locations.map((e, i) => {
                    return (
                      <button key={i} onClick={() => retrieveDistricts(e)}>
                        {e.properties.full_address}
                      </button>
                    );
                  })
                : ""}
            </div>
          </div>
          <br />
          <label>
            {selectedAddress
              ? "Address: " + selectedAddress["properties"].full_address
              : ""}
          </label>
          <br />
          <br /> */}

          {/* MANUAL ADDRESS */}

          <div id="mc_embed_shell">
            <div id="mc_embed_signup">
              <form
                action="https://streetsforall.us4.list-manage.com/subscribe/post?u=e06b221ec788cbd2b542d14e9&amp;id=948112d831&amp;f_id=00b79febf0"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                target="_blank"
              >
                <div id="mc_embed_signup_scroll">
                  <div className="indicates-required">
                    <span className="asterisk">*</span> indicates required
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-EMAIL">
                      Email Address <span className="asterisk">*</span>
                    </label>
                    <input
                      type="email"
                      name="EMAIL"
                      className="required email"
                      id="mce-EMAIL"
                      defaultValue={slug}
                    />
                  </div>
                  {/* <div className="mc-field-group">
                    <label htmlFor="mce-FNAME">
                      First Name <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="FNAME"
                      className="required text"
                      id="mce-FNAME"
                    />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-LNAME">
                      Last Name <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="LNAME"
                      className="required text"
                      id="mce-LNAME"
                    />
                  </div> */}

                  <div className="mc-field-group">
                    <label htmlFor="mce-ADD_ST">Address Line 1 </label>
                    <input
                      type="text"
                      name="ADD_ST"
                      className=" text"
                      id="mce-ADD_ST"
                    />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-ADD_ST_2">Address Line 2 </label>
                    <input
                      type="text"
                      name="ADD_ST_2"
                      className=" text"
                      id="mce-ADD_ST_2"
                    />
                  </div>

                  <div className="mc-field-group">
                    <label htmlFor="mce-ADD_CITY">City</label>
                    <input
                      type="text"
                      name="ADD_CITY"
                      className=" text"
                      id="mce-ADD_CITY"
                    />
                  </div>

                  <div className="mc-field-group">
                    <label htmlFor="mce-MMERGE33">State </label>
                    <input
                      type="text"
                      name="MMERGE33"
                      className=" text"
                      id="mce-MMERGE33"
                    />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-ADD_ZIP">Zip Code </label>
                    <input
                      type="text"
                      name="ADD_ZIP"
                      className=" text"
                      id="mce-ADD_ZIP"
                    />
                  </div>
                  <div id="mce-responses" className="clear">
                    <div
                      className="response"
                      id="mce-error-response"
                      style={{ display: "none" }}
                    ></div>
                    <div
                      className="response"
                      id="mce-success-response"
                      style={{ display: "none" }}
                    ></div>
                  </div>
                  <div
                    style={{ position: "absolute", left: "-5000px" }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="b_e06b221ec788cbd2b542d14e9_948112d831"
                    />
                  </div>
                  <div className="clear">
                    <input
                      data-umami-event="{mailchimp_user_update}"
                      type="submit"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="button"
                      value="Subscribe"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
