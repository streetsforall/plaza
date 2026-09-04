'use server';

const GEODATA_API_BASE_URL = process.env.GEODATA_API_BASE_URL;
const CACHE_SECONDS = 300; // 5 minutes

interface Contact {
  id: string;
  title: string;
  name: string;
  primaryEmail: string;
  secondaryEmail: string;
}

interface ContactsResponse {
  updatedAt: Date;
  contacts: Contact[];
}

async function getCityCouncilMembers(slug: string) {
  const data = await fetch(
    `${GEODATA_API_BASE_URL}/v1/cities/${slug}/council-members?geom=false`,
    {
      next: { revalidate: CACHE_SECONDS },
    },
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
    {
      next: { revalidate: CACHE_SECONDS },
    },
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
    {
      next: { revalidate: CACHE_SECONDS },
    },
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

async function getStateLegislators(chamber: 'assembly' | 'senate') {
  const data = await fetch(
    `${GEODATA_API_BASE_URL}/v1/state-${chamber}-districts?geom=false`,
    {
      next: { revalidate: CACHE_SECONDS },
    },
  );
  const featureCollection = await data.json();

  const contacts = featureCollection.features.map((feature) => {
    return {
      id: feature.id,
      title: feature.properties.extras.code,
      name: feature.properties.person.name,
      primaryEmail: feature.properties.person.contactDetails.find(
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

export {
  type Contact,
  type ContactsResponse,
  getCityCouncilMembers,
  getMetroBoardMembers,
  getNeighborhoodCouncils,
  getStateLegislators,
};
