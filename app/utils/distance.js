export default (start, end) => {
  const deg2rad = (deg) => deg * (Math.PI / 180);
  const R = 6371; // radius of the earth in km
  const dLon = deg2rad(end[0] - start[0]);
  const dLat = deg2rad(end[1] - start[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(start[1])) * Math.cos(deg2rad(start[1])) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // distance in m
};
