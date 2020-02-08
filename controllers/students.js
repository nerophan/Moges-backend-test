const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const DIR_NAME = 'data_dir';
// create if data dir not existed yet
if (!fs.existsSync(DIR_NAME)) {
  fs.mkdirSync(DIR_NAME);
}
const loadStudentData = id => {
  const filePath = path.resolve(DIR_NAME, `${id}.json`)
  // promisify
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err);
      const student = JSON.parse(data);
      resolve(student);
    });
  })
}
const writeStudentData = (id, data) => {
  const filePath = path.resolve(DIR_NAME, `${id}.json`)
  // promisify
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), 'utf8', err => {
      if (err) return reject(err);
      resolve();
    });
  })
}
const getPropertyFromParam = (data, param) => {
  const properties = param.replace('/', '.')
  return _.get(data, properties)
}
exports.putStudentProperty = async (req, res, next) => {
  let student
  try {
    student = await loadStudentData(req.params['id'])
  } catch (err) {
    if (!err.code === 'ENOENT') {
      // file not found
      return res.status(500).json({ err: 'Error loading data' })
    }
    // create file if not exist
  }
  student = student || {} // create a object if student not found
  // set 
  _.set(student, req.params[0].replace(/\//g, '.'), req.body)
  try {
    await writeStudentData(req.params['id'], student)
  } catch (err) {
    return res.status(500).json({ err: 'Error writing data' })
  }
  res.status(200).json(student)
}

exports.getStudentProperty = async (req, res, next) => {
  let student
  try {
    student = await loadStudentData(req.params['id'])
  } catch (err) {
    if (!err.code === 'ENOENT') {
      // file not found
      return res.status(404).send('404')
    }
    return res.status(500).json(err)
  }
  const property = _.get(student, req.params[0].replace(/\//g, '.'))
  res.status(200).json(property)
}

exports.removeStudentProperty = async (req, res, next) => {
  let student
  try {
    student = await loadStudentData(req.params['id'])
  } catch (err) {
    if (!err.code === 'ENOENT') {
      // file not found
      return res.status(404).send('404')
    }
    return res.status(500).json(err)
  }
  let property = _.get(student, req.params[0].replace(/\//g, '.'))
  if (!property) return res.status(404).send('404')
  const propertyPath = req.params[0].split('/')
  delete _.get(student, propertyPath.slice(0, propertyPath.length - 1).join('.'))[propertyPath[propertyPath.length -1]]
  try {
    await writeStudentData(req.params['id'], student)
  } catch (err) {
    return res.status(500).json({ err: 'Error writing data' })
  }
  res.status(200).json(student)
}
