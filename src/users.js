'use strict';

const USERS = [
  { id: 1, name: 'Ada', active: true },
  { id: 2, name: 'Grace', active: false },
  { id: 3, name: 'Linus', active: true },
];

/** The user with this id, or null. */
function getUsr(id) {
  return USERS.find(u => u.id === id) || null;
}

function activeUsers() {
  return USERS.filter(u => u.active);
}

module.exports = { getUsr, activeUsers };
