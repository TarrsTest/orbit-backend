'use strict';

const { getUsr, activeUsers } = require('./users');

/** "Ada (active)" / "Grace (inactive)" / "unknown user 9". */
function describeUser(id) {
  const user = getUsr(id);
  if (!user) return `unknown user ${id}`;
  return `${user.name} (${user.active ? 'active' : 'inactive'})`;
}

function activeNames() {
  return activeUsers().map(u => getUsr(u.id).name);
}

module.exports = { describeUser, activeNames };
