class Synchronizer {
	length = 0
	currentStep = 0
	stepsResolvers = []
	waitAllCount = 0
	waitAllResolver
	data = {}

	/**
	 * the callback will be called by the arr.map()
	 *
	 * @Param {Synchronizer} synchronizer - this will be the first param of the callback
	 * @Param {...any}  - the parameters from the map() will follow in the same order as the map() uses them
	 */
	/**
	 * you can use the constructor to avoid writing Promise.all(arr.map()) too many times
	 *
	 * @Param {Array<any>} arr - the array that will be used for running a map() loop
	 * @Param {function} callback - the function that will be called by the map().
	 */
	constructor (arr, callback){
		if (arr) {
			this.length = arr.length
		}
		if (!arr || !callback) {
			return 
		}
		return Promise.all(arr.map((...params) => callback(this, ...params)))
	}

	/**
	 * will stop the loop untill and will resume them in the order of the index
	 *
	 * @Param {number} index - the index that will have to start with 0.
	 */
	sync (index) {
		const promise = new Promise( resolve => this.stepsResolvers[index] = resolve )
		this.next()
		return promise
	}

	waitAll(index, length) {
		if (!length) {
			length = this.length
		}
		this.waitAllCount = this.waitAllCount + 1
		if (this.waitAllCount >= length) {
			this.waitAllResolver()
		}
		if (this.waitAllResolver) {
			return this.waitAllResolver
		}
		const promise = new Promise( resolve => this.waitAllResolver = resolve )
		return this.waitAllResolver
	 }

	/**
	 * the callback function will be called only once, and runOnce will return the same result/promise for each call
	 *
	 * @Param { ...any} - starting with the 3rd param onward, they will be reuseed to call the callback
	 */
	/**
	 * run a function one time and return the same result/promise each other time
	 *
	 * @Param {function} callback - the function that will be called one single time 
	 * @Param {string} name - this one the identificator for the callback, and should be uniq for each use
	 * @Param {...any} -  any following params will be used to call the callback
	 */
	runOnce(callback, name, ...params) {
		if (!this.data[name]) {
			this.data[name] =  callback(...params)
		}
		return this.data[name]
	}

	async next() {
		await new Promise(resolve => setTimeout(resolve, 0));
		while(this.stepsResolvers[this.currentStep]) {
			this.stepsResolvers[this.currentStep]()
			this.currentStep = this.currentStep + 1
		}
	}
}

module.exports = Synchronizer
