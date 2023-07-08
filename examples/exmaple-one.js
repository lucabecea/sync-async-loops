const Synchronizer = require("..")

const data = []
const populateTheArray = () => {
    for (let i=0; i<1000; i++) {
        data[i] = i
    }
}

const sleepRandom = async (p1, p2) => {
    if (p1 !== 'param1' || p2 !== 'param2') {
        console.warn('params error')
    }
    const timeout = Math.random() * 10
    await new Promise(resolve => setTimeout(resolve, timeout));
    return 'result'
}

const testResults = (results) => {
    let isOkay = true
    results.map((item, index) => {
        if (item !== index) {
            isOkay = false
        }
    })
    console.warn('successful: ', isOkay)
    results = []
}

const exampleOne = async () => {
    let resultsArrOne = []
    let resultsArrTwo = []

    console.warn('\n\n Just mapping without async')
    console.time('1')
    data.map((item) => {
        resultsArrOne.push(item)
    })
    console.timeEnd('1')
    testResults(resultsArrOne)
    
    resultsArrOne = []

    console.warn('\n\n For-of with sleep')
    console.time('2')
    for (const item of data) {
        resultsArrOne.push(item)
        await sleepRandom('param1', 'param2')
        resultsArrTwo.push(item)
    } 
    console.timeEnd('2')
    testResults(resultsArrOne)
    testResults(resultsArrTwo)

    resultsArrOne = []
    resultsArrTwo = []

    console.warn('\n\n Mapping with sleep, and Promise.all')
    console.time('3')
    await Promise.all(
        data.map(async (item, index) => {
            resultsArrOne.push(item)
            await sleepRandom('param1', 'param2')
            resultsArrTwo.push(item)
        })
    )
    console.timeEnd('3')
    testResults(resultsArrOne)
    testResults(resultsArrTwo)

    resultsArrOne = []
    resultsArrTwo = []
    const synchronizer = new Synchronizer()

    console.warn('\n\n Mapping with synchronization, sleep, and Promise.all')
    console.time('4')
    await Promise.all(
        data.map(async (item, index) => {
            resultsArrOne.push(item)
            await synchronizer.runOnce(sleepRandom, 'sleep', 'param1', 'param2')
            await synchronizer.sync(index)
            resultsArrTwo.push(item)
        })
    )
    console.timeEnd('4')
    testResults(resultsArrOne)
    testResults(resultsArrTwo)
} 


populateTheArray()
exampleOne()
