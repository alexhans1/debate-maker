import React, { Component } from 'react';
import '../../stylesheets/Main.css';
import EventTile from "./EventTile";
import EventModal from "./EventModal";
import Loader from "../layout/Loader/Loader";
import EventStore from '../../stores/EventStore';
import * as EventActions from '../../actions/EventActions';

import {Button} from 'reactstrap';

class Main extends Component {

  constructor() {
    super();
    this.getEvents = this.getEvents.bind(this);
    Main.createEvent = Main.createEvent.bind(this);
    this.handleAddEventSubmit = this.handleAddEventSubmit.bind(this);
    this.state = {
      // get all Events
      events: [],
      showNewEventModal: false,
      showLoader: false,
    };
  }

  componentWillMount() {
    EventStore.on('change', this.getEvents);
    this.setState({
      showLoader: true,
    });
    EventActions.getAllEvents();
  }

  componentWillUnmount() {
    EventStore.removeListener('change', this.getEvents);
  }

  getEvents() {
    this.setState({
      events: EventStore.getAllEvents(),
      showLoader: false,
    });
  }

  static createEvent (institution, type, date, password, image) {
    EventActions.createEvent(institution, type, date, password, image);
  }

  handleAddEventSubmit(event) {
    if (event.institution && event.type) {
      Main.createEvent(
        event.institution,
        event.type,
        event.date,
        event.password,
        event.image,
      );
      this.toggleModal();
    }
  };

  toggleModal() {
    this.setState({
      showNewEventModal: !this.state.showNewEventModal,
    });
  }

  render() {
    let openEvents = this.state.events.filter((event) => {
      return event.status === 'OPEN';
    }).sort((a, b) => {
      if (b.date > a.date) {
        return 1;
      }
      if (b.date < a.date) {
        return -1;
      }
      return 0;
    });

    let closedEvents = this.state.events.filter((event) => {
      return event.status === 'CLOSED';
    }).sort((a, b) => {
      if (b.date > a.date) {
        return 1;
      }
      if (b.date < a.date) {
        return -1;
      }
      return 0;
    });

    let loader;
    if (this.state.showLoader) {
      loader = <Loader />
    }

    return (
      <div className="container mb-3">

        {loader}

        <div id="header" className="row mb-2">
          <div className={"col-md-6 mt-2"}>
            <h2>Current Events</h2>
          </div>
          <div className={'col-md-6 mt-2 d-flex justify-content-end'}>
            <Button size={"lg"} color={"danger"} onClick={this.toggleModal.bind(this)}>
              <i className="fa fa-plus-circle" aria-hidden="true" /> Add Event
            </Button>
          </div>
        </div>

        <div className="row">
          <div className={"col-md-12 mb-4"}>
            <h4>Open</h4>
            <hr/>
            <div className={"row"}>
              {
                openEvents.map((event) => {
                  return <EventTile key={event.id} event={event} />
                })
              }
            </div>
          </div>
        </div>

        <div className="row">
          <div className={"col-md-12 mb-4"}>
            <h4>Closed</h4>
            <hr/>
            <div className={"row"}>
              {
                closedEvents.map((event) => {
                  return <EventTile key={event.id} event={event} />
                })
              }
            </div>
          </div>
        </div>

        <EventModal showModal={this.state.showNewEventModal} toggle={this.toggleModal.bind(this)}
                    handleSubmit={this.handleAddEventSubmit} />
      </div>
    );
  }

}

export default Main;
