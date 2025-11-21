module.exports = function parseQuery(q) {
  q = q.toLowerCase();

  const params = {
    borough: null,
    year: null,
    injury: null,
    vehicle: null
  };

  const boroughs = ["brooklyn", "manhattan", "queens", "bronx", "staten island"];

  boroughs.forEach(b => {
    if (q.includes(b)) params.borough = b.replace(/\b\w/g, c => c.toUpperCase());
  });

  q.split(" ").forEach(word => {
    if (/^\d{4}$/.test(word)) params.year = word;
  });

  if (q.includes("pedestrian")) params.injury = "Pedestrian";
  if (q.includes("motorcycle")) params.vehicle = "Motorcycle";
  if (q.includes("bicycle")) params.vehicle = "Bicycle";

  return params;
};
