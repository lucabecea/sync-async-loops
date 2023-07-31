# sync-async-loops


The library purpose is to help you synchronise asynchronous loops in order to obtain a better performance

## Synchronizer

const Synchronizer = require ('sync-async-loops')

const synchronizer = new Synchronizer()

## synchronizer.sync(index) 

Create a point from which the loops will be executed one by one,starting with the first index

It behaves as if the loop just started.

## synchronizer.syncOnce(fn, param1, param2, param3........)

Calls an async function using the provided params, and for each call, it returns the same promise, making sure to make only one call for all the items that are being processed

## Example 1

```
await Promise.all(
    data.map(async (item, index) => {
        resultsArrOne.push(item)
        await synchronizer.runOnce(sleepRandom, 'sleep', 'param1', 'param2')
        await synchronizer.sync(index)
        resultsArrTwo.push(item)
    })
)
```

## Example 2

```
const findProjectsByUserNames = async (userNames) => {  
    const users = await usersRepositoy.findUsersByName(userNames)
    const userIds= [] 
    const projects = []
    await Promise.all(
        users.map(async (user, index) => {
            userIds.push(user.id)
            await synchronizer.sync(index)
            const userProjects = await synchronizer.runOnce(findProjectsByUserIds,userIds)
            projects = projects.concat(userProjects)
        })
    )
    return projects
}
```

