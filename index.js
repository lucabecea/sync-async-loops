class Synchronizer {
    currentStep = 0
    allSteps = []

    async sync (index) {
        const promise = new Promise(resolve => this.allSteps[index] = resolve)
        this.rezolve()
        return promise
    }

    async rezolve() {
        await new Promise(resolve => setTimeout(resolve, 0));
        while(this.allSteps[this.currentStep]) {
            this.allSteps[this.currentStep]()
            this.currentStep = this.currentStep + 1
        }
    }
}

module.exports = Synchronizer