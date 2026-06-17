import React, { useState } from 'react';
import { geoLoader } from '../helpers/geo';
import neighborhoods from '../data/LA_Neighborhood_Councils.json';
import metro from '../data/metro.json';
import cds from '../data/LA_City_Council_Districts.json';
//import assembly from '../data/CA_Assembly_Districts.json';
import senate from '../data/CA_Senate_Districts.json';
import Santa_Monica from '../data/Santa_Monica.json';

interface datafeatures {
  OBJECTID: number;
  NAME: string;
  WADDRESS: string;
  DWEBSITE: string;
  DEMAIL: string;
  DPHONE: string;
  NC_ID: number;
  CERTIFIED: string;
  TOOLTIP: string;
  NLA_URL: string;
  SERVICE_RE: string;
}

export default function ContactLibrary({
  recipients,
  setRecipients,
}) {
  const [data, setData] = useState<any>([]);
  const [areDeputiesShown, setAreDeputiesShown] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  const categories = [
    {
      id: 'nc',
      label: 'LA Neighborhood Councils',
      data: neighborhoods.features,
    },
    /*{
        id: 'cd',
        label: 'LA City Council',
        data: cds.features,
      },*/
    {
      id: 'metro',
      label: 'Metro',
      data: metro.features,
    },
    {
      id: 'santamonica',
      label: 'Santa Monica',
      data: Santa_Monica.features,
    },
    /*{
        id: 'assembly',
        label: 'Assembly',
        data: assembly.features,
      },
      {
        id: 'senate',
        label: 'Senate',
        data: senate.features,
      }*/
  ];

  // TODO: Rewrite this whole componenet to injest from our API
  // const geodata = geoLoader(e, false);

  function addAll() {
    const updatedRecipients = data.flatMap((feature) => {
      if (areDeputiesShown && feature.properties.Deputy) {
        // Include deputy email if applicable
        return [feature.properties.DEMAIL, feature.properties.Deputy];
      } else {
        return feature.properties.DEMAIL;
      }
    });

    // Replace the existing list, not append to it
    setRecipients(updatedRecipients);
  }

  /**
   * Add/remove recipients
   * @param contactEmail - Primary contact email
   * @param deputyEmail - Deputy email if applicable
   */
  function updateRecipients(contactEmail, deputyEmail) {
    let selectedEmails = [contactEmail];

    // Include deputy email if applicable
    if (areDeputiesShown && deputyEmail) {
      selectedEmails.push(deputyEmail);
    }

    var updatedRecipients = recipients;

    selectedEmails.forEach((email) => {
      if (!updatedRecipients.includes(email)) {
        updatedRecipients.push(email);
      } else {
        updatedRecipients.splice(updatedRecipients.indexOf(email), 1);
      }
    });

    setRecipients(updatedRecipients);
  }

  return (
    <div className="data_field">
      <h3>Contact Library</h3>
      <label>
        Use this to select emails of representatives. NOTE: These have not been
        updated post 2024 Nov. election
      </label>
      <br /> <br />
      {/* Category filter */}
      <div id="filter">
        {categories.map((category) => (
          <button
            key={category.id}
            className={activeCategory === category.id ? 'selected' : ''}
            onClick={() => {
              setActiveCategory(category.id);
              setAreDeputiesShown(false);
              setData(category.data);
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
      {/* Contact list */}
      {data.length ? (
        <div id="options">
          <div id="filter_header">
            <button onClick={addAll}>Add All</button>

            <button
              className={
                activeCategory == 'metro' || activeCategory == 'cd'
                  ? 'shown'
                  : 'hidden'
              }
              onClick={() => {
                setAreDeputiesShown(!areDeputiesShown);
              }}
            >
              {!areDeputiesShown ? 'Include Deputies' : 'Exclude Deputies'}
            </button>

            <button
              className="hider"
              onClick={() => {
                setData([]);
                setActiveCategory('');
              }}
            >
              X
            </button>
          </div>

          <table>
            <tbody>
              {data.map((feature, index) => {
                if (feature.properties.DEMAIL) {
                  return (
                    <tr
                      key={index}
                      data-email={feature.properties.DEMAIL}
                      className="geo_selector"
                      onClick={() => {
                        updateRecipients(
                          feature.properties.DEMAIL,
                          feature.properties.Deputy,
                        );
                      }}
                    >
                      <td
                        className={
                          feature.properties.District
                            ? 'short shown'
                            : 'short hidden'
                        }
                      >
                        {feature.properties.District}
                      </td>
                      <td>{feature.properties.NAME}</td>
                      <td className="data_email">
                        {feature.properties.DEMAIL}
                      </td>
                      <td>{areDeputiesShown && feature.properties.Deputy}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
