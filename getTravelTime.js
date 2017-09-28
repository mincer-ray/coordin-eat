const client = require('@google/maps').createClient({
	key: 'AIzaSyB6N413BwZWE2KkNTdb0wsxQZw6VlrUvdU',
	Promise: Promise
})

const getTravelTime =(origin, dest, mode) => {
	const query = {
		origins: [origin],
		destinations: [dest],
		mode: mode
	}
	return client.distanceMatrix(query).asPromise()
	.then(res => res.json.rows[0].elements[0].duration.value / 60.0 )

	// 	, (res, status) => {
	// 	const tTime = res.rows.elements[0].duration.value / 60.0
	// 	console.log('time is', tTime)
	// })
}

// 	getTravelTime([40.739999, -73.983083], [40.768007, -74.204254], 'transit')
// .then(console.log)

export default getTravelTime