const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true
    }
  },
  { timestamps: true }
)
const category = mongoose.model('Category', categorySchema)

category.createDocument = async newCategory => {
  try {
    return await category.create(newCategory)
  } catch (err) {
    return {
      error: 'error creating a new category',
      err
    }
  }
}

category.getAllDocuments = async _ => {
  try {
    return await category.find()
  } catch (err) {
    return {
      error: 'error getting all the categories from the database',
      err
    }
  }
}

category.getDocumentById = async id => {
  try {
    return await category.findById(id)
  } catch (err) {
    return {
      error: 'error getting the category by id',
      err
    }
  }
}

category.getDocumentByName = async name => {
  try {
    return await category.find({ name })
  } catch (err) {
    return {
      error: 'error getting the category by name',
      err
    }
  }
}

category.updateDocument = async categoryData => {
  try {
    const { categoryId, newCategory } = categoryData
    console.log('category Id in updateDocument', categoryId)
    const categoryDB = await category.findById(categoryId)
    if (categoryDB) {
      categoryDB.name = newCategory.name || category.name
      const updatedCategory = await categoryDB.save()
      return updatedCategory
    } else {
      return {
        error: 'category category does not exists in our records'
      }
    }
  } catch (err) {
    return {
      error: 'error updateing the category by id',
      err
    }
  }
}

category.deleteDocument = async id => {
  try {
    await category.deleteOne({ _id: id })
  } catch (err) {
    return {
      error: 'error deleting the category from the database',
      err
    }
  }
}

module.exports = category
