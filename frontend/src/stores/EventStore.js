import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

class EventStore extends EventEmitter {
  constructor() {
    super();
    this.events = [];
  }

  async fetchEvents () {
    try {
      await fetch('/event')
      .then(res => res.json())
      .then(events => {
        this.events = events;
        this.emit('change');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  getAllEvents () {
    return this.events;
  }

  getEvent (id) {
    let event = this.events.find((event) => {
      return event.id === parseInt(id, 10);
    });
    return event || null;
  }

  async createEvent(institution, type, date, password) {
    if (institution && type && password) {
      try {
        await fetch('event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            institution,
            type,
            date,
            password,
          })
        }).then((response) => {
          if (response.ok) {
            this.fetchEvents();
          }
        });
      } catch (ex) {
          console.error(ex);
      }
    }
  }

  async deleteEvent(id) {
    if (id) {
      try {
        await fetch('event/' + id, {
          method: 'DELETE',
        }).then((response) => {
          if (response.ok) {
            this.fetchEvents();
          }
        });
      } catch (ex) {
          console.error(ex);
      }
    }
  }

  handleAction(action) {
    switch (action.type){
      case "GET_EVENTS": {
        this.fetchEvents();
        break;
      }
      case "CREATE_EVENT": {
        this.createEvent(action.institution, action.eventType, action.date, action.password);
        break;
      }
      case "DELETE_EVENT": {
        this.deleteEvent(action.id);
        break;
      }
      default: {
        // do nothing
      }
    }
  }
}

const eventStore = new EventStore();

dispatcher.register(eventStore.handleAction.bind(eventStore));

export default eventStore;
