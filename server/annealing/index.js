const Chance = require('chance')
const chance = new Chance()
var math = require('mathjs')

// =============== VECTOR STUFF =========================
const addVect = (...arr) => {
	const result = [0,0]
	arr.map((el) => {
		result[0] += el[0]
		result[1] += el[1]
	})
	return result
}

const scaleVect = (vec1, scale) => {
	return [vec1[0] * scale, vec1[1] * scale]
}

const centerCoord = (...arr) => {
	let result = addVect(...arr)
	return scaleVect(result, 1 / arr.length)
}

const maxDistanceFromCentroid = (centroid, origins) => {
	const dists = origins.map(coord => math.distance(coord, centroid))
	return math.max(dists)
}

// ================== POSSIBLE MEETUPS =====================
// creates circles of new meetup candidates from a center coordinate
const createCandidates = (n, center, bound) => {
	const radiiRatio = [.005, .1,.2,.5, .9]
	const radii = radiiRatio.map(ratio => ratio * bound)
	const inCircleRatios = [.02, .08, .15, .25, .5]
	const inCircle = inCircleRatios.map(ratio => {
		return math.ceil(n*ratio)
	})
	
	const result = [center]
	inCircle.forEach((num, idx) => {
		const deg = 360/ num
		const fuzzRate = .2
		for (let p = 0; p < num; p++){
			const newCoord = [
				center[0] + chance.normal({mean: 1, dev: fuzzRate}) * radii[idx] * math.sin(math.unit(p*deg, 'deg')),
				center[1] + chance.normal({mean: 1, dev: fuzzRate}) * radii[idx] * math.cos(math.unit(p*deg, 'deg'))
			]
			result.push(newCoord)
		}
	})
	return result
}

// ==================== API REQUESTS & STUFF ===================

const client = require('@google/maps').createClient({
	key: process.env.GOOGLE_DIRECTIONS_KEY,
	Promise: Promise
})

const getTravelTime = (origin, dest, mode) => {
	const query = {
		origins: [origin],
		destinations: [dest],
		mode: mode
	}
	return client.distanceMatrix(query).asPromise()
		.then(res => {
			return res.json.rows[0].elements[0].duration.value / 60.0
		})
		.catch(console.error.bind(console))
}

// ====================== PROMISES/SCORING =========================

const locationPromiseAll = (loc, origins) => {
	const locationsPromises = origins.map(origin => {
		return getTravelTime(origin, loc, 'transit')
	})
	return Promise.all(locationsPromises)
}

const importance = .7 	
// used for scaling the importance of 
// similar travel times vs. total time traveled per group
const locationScore = (loc, origins) => {
	return locationPromiseAll(loc, origins)
		.then(times => {
			const sum = times.reduce((a, b) => a + b)
			const std = math.std(times)
			const score = sum * Math.pow(std, importance)
			return score
		})
		.catch(console.error.bind(console))
}

const candScorePromiseAll = (candArr, origins) => {
	const candPromises = candArr.map(candidate => {
		return locationScore(candidate, origins)
	})
	return Promise.all(candPromises)
}

//========================== THE ANNEALING =============================

const anneal = (origins = [], center, lowScore = 9999, tighten = 1) => {
	const centroid = center || centerCoord(...origins)	
	const numCands = math.max(15, 75 / origins.length) * tighten
	const calcBound = maxDistanceFromCentroid(centroid, origins)
	let cands = createCandidates(numCands, centroid, calcBound * 2.5)
	return candScorePromiseAll(cands, origins)
		.then(scores => {
			scores = scores.map(score => score ? score : 9999)
			const indexOfMin = scores.indexOf(math.min(scores))	
			const winner = lowScore < scores[indexOfMin] ? [centroid, lowScore] : [cands[indexOfMin], scores[indexOfMin]]
			return winner	
		})
		.catch(console.error.bind(console))
}

module.exports = anneal