#!/usr/bin/env node

const path = require("path")
const chalk = require("chalk")
const fs = require("fs-extra")
const spawn = require("cross-spawn")
const inquirer = require("inquirer")

const CURR_DIR = process.cwd()
const log = console.log

const createApp = async () => {
  let { projectName } = await project_name()
  let { framework } = await framework_name()

  const projectFolder = path.join(CURR_DIR, projectName)
  const templateFolder = path.join(CURR_DIR, "template", framework)
  const dependencies = dependencies_for[framework]

  try {
    await fs.ensureDir(projectFolder)
    await fs.copy(templateFolder, projectFolder)
    await fs.writeJson(
      path.join(projectFolder, "package.json"),
      packageJson(projectName),
      {
        spaces: 2
      }
    )

    process.chdir(projectFolder)

    log(chalk.yellow("Installing Dependencies..."))
    await install_dependencies(devDependencies)
    await install_dependencies(dependencies)
  } catch (err) {
    if (err.command) command_error(err.command)
    else log(chalk.red(err))

    fs.emptyDir(projectFolder, err => {
      if (err) log(chalk.red(err))
    })

    process.exit(1)
  }

  return projectName
}

createApp().then(projectName => {
  log(
    `
    ${chalk.green("Ready to rock :)")}
    
    run:

    ${chalk.green(`cd ${projectName}`)}
    ${chalk.green("npm start")}
    `
  )
})

function project_name() {
  return inquirer.prompt({
    type: "input",
    name: "projectName",
    message: "Project Name: ",
    filter: query => {
      return query
        .toLowerCase()
        .trim()
        .split(" ")
        .join("-")
    },
    validate: query => {
      if (query.length) return true
      else return "Enter a fucking project name..."
    }
  })
}

function framework_name() {
  return inquirer.prompt({
    type: "list",
    name: "framework",
    message: "Choose your Guns: ",
    choices: ["React", "Preact", "Vue", "Frameworks is for pussies"]
  })
}

function preprocessors_name() {
  return inquirer.prompt({
    type: "list",
    name: "preprocessor",
    message: "Choose your Power-up: ",
    choices: ["Sass", "Scss", "Less", "Stylus", "Vanilla please"]
  })
}

function packageJson(projectName) {
  return {
    name: projectName,
    version: "0.1.0",
    private: true,
    author: process.env.USER || os.hostname(),
    license: "MIT",
    scripts: {
      start: "webpack-dev-server --mode development --open",
      build: "webpack --mode production"
    }
  }
}

function install_dependencies(dependencies) {
  return new Promise((resolve, reject) => {
    const args = ["install", "--loglevel", "error"].concat(dependencies)

    const child = spawn("npm", args, { stdio: "inherit" })
    child.on("close", code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`
        })
      }
      resolve()
    })
  })
}

function command_error(command) {
  log(
    `
    ${chalk.red("The following command has failed:")}
    
    ${chalk.yellow(command)}
    `
  )
}

function unknown_error() {
  log(chalk.red("Unexpected error. Please report it as a bug:"))
}

var dependencies_for = {
  React: ["react", "react-dom"],
  Preact: ["preact", "preact-compat"]
}

var devDependencies = [
  "--save-dev",
  "autoprefixer",
  "babel-core",
  "babel-loader",
  "babel-eslint",
  "babel-preset-env",
  "babel-plugin-transform-react-jsx",
  "eslint",
  "eslint-loader",
  "eslint-plugin-flowtype",
  "eslint-plugin-import",
  "eslint-plugin-jsx-a11y",
  "eslint-plugin-react",
  "file-loader",
  "style-loader",
  "css-loader",
  "postcss-loader",
  "url-loader",
  "html-webpack-plugin",
  "mini-css-extract-plugin",
  "webpack",
  "webpack-cli",
  "webpack-dev-server"
]
