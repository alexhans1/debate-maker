import dispatcher from "../dispatcher";

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

export function updateRoom(room) {
  dispatcher.dispatch({
    type: "UPDATE_ROOM",
    room,
  });
}
