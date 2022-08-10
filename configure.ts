import dotenv from 'dotenv'
import moduleAlias from 'module-alias'
import path from "path";

dotenv.config()
moduleAlias.addAliases({
  "@root"      : __dirname,
  "@src"      : path.join(__dirname, "src"),
  "@api"      : path.join(__dirname, "api"),
})
