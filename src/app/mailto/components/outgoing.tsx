import React, { useState, useEffect } from "react";

const Outgoing = ({
  actionable,
  setActionable,
  districtVar,
  hash,
  setDistrictVar,
  isShareable,
  setIsShareable,
  isPhone,
  setPhone,
}) => {
  // this component manages the outlist
  const addOut = (item) => {
    let newList = [...districtVar];

    console.log("itemlist before", newList);

    if (newList.includes(item)) {
      newList?.splice(newList.indexOf(item), 1); //deleting
    } else {
      newList?.push(item);
    }

    setDistrictVar(newList);

    console.log("itemlist after", newList);
    console.log("districtVar", districtVar);
  };

  // useEffect(() => {
  //     console.log('districtVar', districtVar)
  // }, [districtVar]);

  // async copy current email state to clipboard use
  async function copyLink(e) {
    // need to generate link
    const content =
      location.href.replace(location.hash, "") + "/out/*|EMAIL|*" + hash;

    e.target.innerText = "Copied Link!";
    navigator.clipboard.writeText(content).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  return (
    <div className="data_field">
      <h3>Sharable Link Generator</h3>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <label style={{ marginRight: ".5rem", width: "58%" }}>
          Use this to select the catagories of representative that will be sent
          to audience members and autofilled based on their address.
        </label>

        <div>
          <button
            className="m_button"
            id="shareable"
            onClick={() => setIsShareable(!isShareable)}
          >
            {isShareable ? "🗣️ Shareable" : "⛔ Not Shareable"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "1rem",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {isShareable ? (
          <div style={{ marginTop: ".5rem" }}>
            <button
              className={
                "m_button" +
                (districtVar.includes("Assembly", 0) ? " selected" : "")
              }
              onClick={() => {
                addOut("Assembly");
              }}
            >
              Assembly
            </button>
            <button
              className={
                "m_button" +
                (districtVar.includes("Senate", 0) ? " selected" : "")
              }
              onClick={() => {
                addOut("Senate");
              }}
            >
              Senate
            </button>
            {/* {districtVar} */}
          </div>
        ) : (
          ""
        )}
        <div style={{ marginTop: "rem", justifyContent: "space-between" }}>
          {isShareable ? (
            districtVar?.length > 0 ? (
              <button className="m_button" onClick={(e) => copyLink(e)}>
                Copy Shareable Link
              </button>
            ) : (
              <label>Select Assembly or Senate</label>
            )
          ) : (
            ""
          )}
        </div>
      </div>
      {isShareable ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label className="main_label">Header for sharable link</label>
          <textarea
            id="header_field"
            value={decodeURIComponent(actionable.header)}
            rows={1}
            onChange={(e) => {
              setActionable({"header": e.target.value, "body" : actionable.body});
            }}
          />

          <label className="main_label">Body for sharable link</label>
          <textarea
            id="header_field"
            value={decodeURIComponent(actionable.body)}
            rows={4}
            onChange={(e) => {
              setActionable({"header": actionable.header, "body" : e.target.value});
            }}
          />

          <div>
            {isShareable ? (
              <button className="l_button" onClick={(e) => setPhone(!isPhone)}>
                {isPhone ? "☎️ Phone CTA" : " Not Phone CTA"}
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Outgoing;
