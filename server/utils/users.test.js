const expect = require('expect');
const {Users}= require('./users');

describe('Users', () => {

  let users;
  beforeEach(() => {
    users= new Users();
    users.users = [{
      id: '1',
      name: 'Ann',
      room: 'Node js'
    }, {
      id: '2',
      name: 'Andrew',
      room: 'React'
    }, {
      id: '3',
      name: 'Nick',
      room: 'Node js'
    }];
  });

  it('should add a new user', () => {
    let users = new Users();

    let user = {
      id: '123',
      name: 'Ann',
      room: 'Node js'
    };

    let resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove user', () => {
    let userId = '2';

    let user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    let userId = '4';

    let user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    let userId = '2';
    let user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    let userId = '4';
    let user = users.getUser(userId);

    expect(user).toNotExist();
  });


  it('should return names for \"Node js room\"', () => {
    let room = 'Node js';
    let usersList = users.getUserList(room);

    expect(usersList.length).toBe(2);
    expect(usersList).toEqual(['Ann', 'Nick']);
  });

  it('should return name for \"React room\"', () => {
    let room = 'React';
    let usersList = users.getUserList(room);

    expect(usersList.length).toBe(1);
    expect(usersList).toEqual(['Andrew']);
  });
});
