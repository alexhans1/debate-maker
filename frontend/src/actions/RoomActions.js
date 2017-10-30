import dispatcher from "../dispatcher";

export function getAllRooms(eventId) {
  dispatcher.dispatch({
    type: "GET_ROOMS",
    eventId: eventId,
  });
}

export function createRoom(location, format, language) {
  dispatcher.dispatch({
    type: "CREATE_ROOM",
    location,
    format,
    language,
  });
}

export function deleteRoom(id) {
  dispatcher.dispatch({
    type: "DELETE_ROOM",
    id,
  });
}
