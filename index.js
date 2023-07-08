class Synchronizer {
    currentStep = 0
    stepsResolvers = []
    data = {}

    sync (index) {
        const promise = new Promise(resolve => this.stepsResolvers[index] = resolve)
        this.next()
        return promise
    }

    async next() {
        await new Promise(resolve => setTimeout(resolve, 0));
        while(this.stepsResolvers[this.currentStep]) {
            this.stepsResolvers[this.currentStep]()
            this.currentStep = this.currentStep + 1
        }
    }

    runOnce(callback, name, ...params) {
        if (!this.data[name]) {
            this.data[name] =  callback(...params)
        }
        return this.data[name]
    }
}

module.exports = Synchronizer