'use server';

const GEODATA_API_BASE_URL = process.env.GEODATA_API_BASE_URL;

async function getCityCouncilMembers(slug: string) {
  const data = await fetch(
    `${GEODATA_API_BASE_URL}/v1/cities/${slug}/council-members?geom=false`,
  );
  const featureCollection = await data.json();

  const contacts = featureCollection.features.map((feature) => {
    return {
      id: feature.id,
      title: `${feature.properties.post.role} - ${feature.properties.post.division.name}`,
      name: feature.properties.person.name,
      primaryEmail: feature.properties.person.contactDetails.find(
        (detail) => detail.type === 'email',
      ).value,
      secondaryEmail: feature.properties.extras.deputyEmail,
    };
  });

  return {
    updatedAt: featureCollection.updatedAt,
    contacts,
  };
}

async function getMetroBoardMembers() {
  const data = await fetch(
    `${GEODATA_API_BASE_URL}/v1/metro-board-members?geom=false`,
  );
  const featureCollection = await data.json();

  const contacts = featureCollection.features.map((feature) => {
    return {
      id: feature.id,
      title: feature.properties.post.label,
      name: feature.properties.person.name,
      primaryEmail: feature.properties.person.contactDetails.find(
        (detail) => detail.type === 'email',
      ).value,
      secondaryEmail: feature.properties.extras.deputyEmail,
    };
  });

  return {
    updatedAt: featureCollection.updatedAt,
    contacts,
  };
}

async function getNeighborhoodCouncils() {
  const data = await fetch(
    `${GEODATA_API_BASE_URL}/v1/cities/los-angeles/neighborhood-councils?geom=false`,
  );
  const featureCollection = await data.json();

  const contacts = featureCollection.features.map((feature) => {
    return {
      id: feature.id,
      title: null,
      name: feature.properties.name,
      primaryEmail: feature.properties.contactDetails.find(
        (detail) => detail.type === 'email',
      ).value,
      secondaryEmail: null,
    };
  });

  return {
    updatedAt: featureCollection.updatedAt,
    contacts,
  };
}

export { getCityCouncilMembers, getMetroBoardMembers, getNeighborhoodCouncils };
