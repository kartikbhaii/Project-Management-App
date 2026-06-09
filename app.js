import dotenv from "dotenv"

dotenv.config({
  path: "./.env",
  override: true,
})

console.log(process.env.username)
