const User = require('./user')
const Location = require('./location')
const Trip = require('./trip')
const Attendee = require('./attendee')

User.hasMany(Location)
Location.belongsTo(User, {foreignKey: { allowNull: false }, onDelete: 'CASCADE'})

User.belongsToMany(User, {as: 'friend', through: 'friends'})

Trip.hasMany(Attendee)
User.hasMany(Attendee)
Attendee.belongsTo(Trip)
Attendee.belongsTo(User)



/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
	User,
	Location,
	Trip,
	Attendee
}
