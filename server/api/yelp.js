const router = require('express').Router()
var fetch = require('node-fetch')
module.exports = router

router.get('/:xcoord/:ycoord', (req, res, next) => {
	let theresMore = true
	//let offset = -50
	let resultArr = []
	let promiseArray = []
	let term = 'restaurants'
	while(theresMore){
		//offset += 50
		/*if(offset > 1000) */theresMore = false
		promiseArray.push(fetch('https://api.yelp.com/v3/businesses/search?term=' + term + '&latitude=' + req.params.xcoord + '&longitude=' + req.params.ycoord + '&radius=50&limit=10'/*&offset=' + offset*/,
			{method: 'GET', headers: {'Authorization': 'Bearer CE30IUOIN3D8-Ipws-4okoFMnjBaTzWjiPeZqZLrLfrst68H_h7jDXJWwJzJ4csFW9C77V1f4suaIJpK1PW7bicPuwFJQl_MEERkKRaIYmnIYamOyfTkgTWpsEvNWXYx'}}
		)
			.then(data => data.json())
			.then(searchResults => {
				let businesses = searchResults.businesses
				if(businesses){
					businesses.forEach(business =>{
						resultArr.push(business)
					})
				}
				//console.log('length:', resultArr.length, 'type of:', Array.isArray(businesses))
			})
			.catch(next)
		)
	}
	Promise.all(promiseArray)
		.then(() => {
			res.json(resultArr)
		})
})