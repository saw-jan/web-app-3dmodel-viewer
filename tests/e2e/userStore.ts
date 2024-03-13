import { config } from "./config.js"

interface User {
    displayName: string,
    password: string
}

const userStore = new Map<string, User>([
    [
        'admin',
        {
            displayName: config.adminUser,
            password: config.adminPassword,
        }
    ]
])

export const getUser = async function({user}) {
    const userKey = user.toLowerCase()
    if (!userStore.has(userKey)) {
        throw new Error(`user with key '${userKey}' not found`)
    }

    return userStore.get(userKey)
}