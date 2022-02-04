const { ObjectId } = require("mongodb")
const request = require("supertest")
const app = require("../src/app")
const { connectToDB, closeConnection, getDB } = require("../src/database")

const baseUrl = "/todos"

beforeAll(async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    const MONGODB_DB = process.env.MONGODB_DB || 'mytodos-test'

    await connectToDB(MONGODB_URI, MONGODB_DB)
})

afterAll(async () => {
    closeConnection()
})


beforeEach(async () => {
    const db = getDB()
    await db.createCollection("todos")
})

afterEach(async () => {
    const db = getDB()
    await db.dropCollection("todos")
})

describe("GET /todos", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.statusCode).toBe(200)
    })

    test("should respond with JSON", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.type).toBe("application/json")
        //throw new Error("Not yet implemented")
    })

    test("should respond with list of existing todos", async () => {
        const todo1 = {title: "Todo1",
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()}

        const todo2 = {title: "Todo2",
            completed: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()}

        await getDB().collection("todos").insertMany([todo1, todo2])

        const response = await request(app.callback()).get(baseUrl)
        expect(response.body).toMatchObject([todo1, todo2])
    })
})

describe("POST /todos", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.statusCode).toBe(200)
    })

    test("should respond with JSON", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.type).toBe("application/json")
        //throw new Error("Not yet implemented")
    })

    test("should respond with list of existing todos", async () => {
        const todo1 = {title: "Todo1"}

        await getDB().collection("todos").findOne(todo1)

        const response = await request(app.callback()).get(baseUrl)
        expect(response.body).toMatchObject([todo1, todo2])
    })
})
