const adaptToApp = (point) => ({
  id: point.id,
  type: point.type,
  destinationId: point.destination,
  dateFrom: new Date(point.date_from),
  dateTo: new Date(point.date_to),
  basePrice: point.base_price,
  isFavorite: point.is_favorite,
  offers: Array.isArray(point.offers) ? [...point.offers] : [],
});

const adaptToServer = (point) => {
  const serverPoint = {
    type: point.type,
    destination: point.destinationId,
    'date_from': point.dateFrom.toISOString(),
    'date_to': point.dateTo.toISOString(),
    'base_price': point.basePrice,
    'is_favorite': point.isFavorite,
    offers: [...point.offers],
  };

  if (point.id) {
    serverPoint.id = point.id;
  }

  return serverPoint;
};

export {adaptToApp, adaptToServer};
