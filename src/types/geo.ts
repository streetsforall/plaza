const geotargetOptions = [
  {
    id: 'assembly',
    name: 'Assembly',
    endpoint: 'state-assembly-districts',
  },
  {
    id: 'senate',
    name: 'Senate',
    endpoint: 'state-senate-districts',
  },
] as const;

// Use as type
type GeotargetOptions = (typeof geotargetOptions)[number]['name'];

export { geotargetOptions, type GeotargetOptions };
