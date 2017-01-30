// create class Users

class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    let user = {id, name, room};

    let duplicateNameArr = this.users.filter(user => user.name.toLowerCase() === name.toLowerCase());

    if(this.users.length >= 0 && duplicateNameArr.length === 0) {
      this.users.push(user);
      return user;
    } else {
      return 0;
    }
  }

  removeUser (id) {
    let user = this.getUser(id);

    if(user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser (id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    let users = this.users.filter((user) => user.room === room);
    let namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users};
