# sync-async-loops

The library purpose is to help you synchronise asynchronous loops in order to obtain a better performance

## Synchronizer

const Synchronizer = require ('sync-async-loops')

const synchronizer = new Synchronizer() if you want to use your own Promise.all(data.map())

await new Synchronizer(data, (synchronizer, item, index, .....) => {})

- the first argument in the callback is the synchronizer,
- the rest of the arguments are the arguments for the callback from data.map()

## synchronizer.sync(index) 

Create a point from which the loops will be executed one by one,starting with the first index

It behaves as if the loop just started.

## synchronizer.syncOnce(fn, param1, param2, param3........)

Calls an async function using the provided params, and for each call, it returns the same promise, making sure to make only one call for all the items that are being processed

## synchronizer.waitAll(index, length?)

- unlike sync, this one waits for all the loops to reach this point before letting them go

- if we use Synchronizer(data, () => {}) instead of Promise.all(data.map()) then we can ommit the length paramter

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
    await new Synchronizer( users, async (user, index) => {
        userIds.push(user.id)
        await synchronizer.waitAll(index)
        const userProjects = await synchronizer.runOnce(findProjectsByUserIds, 'getProjectUsers', userIds)
        const projectsMap = synchronizer.runOnce(mapProjects, 'mapProjectUsers', userProjects)
        const project = projectsMap.get(userId)
        projects.push({
            ...project, 
            userFullName: `${user.firstName} ${user.lastName}`
        })
    })
    return projects
}

const mapProjects (userProjects) => {
    const projectsMap = new Map()
    for (project of Projects){
        projectsMap.set(project.user.id, project)
    }
    return projectsMap
}
```

