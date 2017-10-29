import React, { Component } from 'react';
import update from 'react/lib/update';
import NewUserModal from './NewUserModal';
import Card from '../Card';
import { DropTarget } from 'react-dnd';
import '../../stylesheets/List.css'
import remove from 'lodash/remove';

import {FormGroup, Label, Input} from 'reactstrap'

class List extends Component {

  newUserDefaults = {
    name: '',
    role: 'speaker',
    format: 'BPS',
    language: 'de',
  };

  constructor(props) {
    super();
    this.state = {
      cards: props.users,
      idList: props.users.map((user) => {
        return user.id
      }),
      newUser: this.newUserDefaults,
      showModal: false,
    };

    this.handleAddUserSubmit = this.handleAddUserSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps){
    nextProps.users.forEach((user) => {
      if (!this.state.idList.includes(user.id)) {
        this.state.cards.push(user);
        this.state.idList.push(user.id);
        this.setState({
          cards: this.state.cards,
          idList: this.state.idList,
        })
      }
    });
  }

  componentWillMount(){
    document.addEventListener("keypress", this.handleKeyPress.bind(this));
  }

  componentWillUnmount(){
    document.removeEventListener("keypress", this.handleKeyPress.bind(this));
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (this.state.newUser.name === '') {
        // TODO mark input box red

      }
      else {
        // open modal
        this.setState({
          showModal: true,
        });
      }
    }
  }

  handleChangeFor = (propertyName) => (event) => {
    const { newUser } = this.state;
    const userToAdd = {
      ...newUser,
      [propertyName]: event.target.value
    };
    this.setState({ newUser: userToAdd, });
  };

  handleAddUserSubmit() {
    if (this.state.newUser.name !== '') {
      this.props.createUser(
        this.state.newUser.name, this.state.newUser.role,
        this.state.newUser.format, this.state.newUser.language);
      this.setState({
        newUser: this.newUserDefaults,
        showModal: false,
      });
    }
  };

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  pushCard(card) {
    this.setState(update(this.state, {
      cards: {
        $push: [ card ]
      }
    }));
  }

  removeCard(index) {
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [index, 1]
        ]
      }
    }));
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  deleteCard(id) {
    let newUsersArray = this.state.cards.slice();
    remove(newUsersArray, {id});
    this.setState({
      cards: newUsersArray,
    });
    this.props.deleteUser(id);
  }

  render() {
    const { cards } = this.state;
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    const backgroundColor = isActive ? 'lightgreen' : 'rgba(0, 0, 0, 0.0)';

    return connectDropTarget(
      <div className={"list"} style={{backgroundColor}}>
        <FormGroup>
          <Label for="userName" hidden>User Name</Label>

          <Input type="text" value={this.state.newUser.name} onChange={this.handleChangeFor('name')}
                 name="user name" id="userName" placeholder="Add user" />
        </FormGroup>
        {cards.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              listId={this.props.id}
              card={card}
              removeCard={this.removeCard.bind(this)}
              moveCard={this.moveCard.bind(this)}
              deleteCard={this.deleteCard.bind(this)} />
          );
        })}

        {/*initialize new user modal*/}
        <NewUserModal showModal={this.state.showModal} toggle={this.toggleModal.bind(this)}
                      handleChange={this.handleChangeFor} newUser={this.state.newUser}
                      handleSubmit={this.handleAddUserSubmit} />
      </div>
    );
  }
}

const cardTarget = {
  drop(props, monitor, component ) {
    const { id } = props;
    const sourceObj = monitor.getItem();
    if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card);
    return {
      listId: id
    };
  }
};

export default DropTarget("CARD", cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(List);
