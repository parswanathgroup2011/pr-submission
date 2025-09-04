const PRCategory = require("../Models/prCategory");

//create a New PR category

const createPRCategory = async (req,res) => {
  try{

    const{name,isActive,order}=req.body;

    if(!name){
      return res.status(400).json({error:"name is required"});
    }

    const existingCategory = await PRCategory.findOne({name});
    if(existingCategory){
      return res.status(400).json({error:"This category name already exists"})
    }

    const newCategory = new PRCategory({name,isActive, order});
    await newCategory.save()


    res.status(201).json({
      message:"PR Category is created successfully",
      prCategory: newCategory
    })
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Server error"})

  }
}

//Get all PR sorted by category

const getAllPRCategories = async (req,res) => {
  try{
    const categories = await PRCategory.find().sort({order:1,name:1});
    res.status(200).json(categories)

  }catch(error){
    console.log(error);
    res.status(500).json({error:"Server error"})
  }
}


//Get PR Category by id

const getPRCategoryById = async(req,res) => {
  try{
    const category =await PRCategory.findById(req.params.id);
    if(!category){
      return res.status(404).json({error:"Category not found"})
    }
    res.status(200).json(category)
  }catch(error){
    console.log(error)
    res.status(500).json({error:"Server error"})
  }
};


//Update PR category by ID

const updatePRCategory = async(req,res) => {
  try{
    const {name,isActive,order} =req.body;
    const category = await PRCategory.findById(req.params.id);

    if(!category){
      return res.status(404).json({error:"Category not found"})
    }

    category.name = name || category.name;
    category.isActive = isActive !== undefined ? isActive :category.isActive;
    category.order = (order !== undefined && typeof order === 'number') ? order : category.order;

    await category.save()

    res.status(200).json({
      message:"PR Category Updated Successfully",
      prCategory: category
    })

  }catch(error){
    console.log(error)
    res.status(500).json({error:"Server error"})
  }
}


// Delete PR Category By ID

const deletePRCategory = async(req,res) => {
  try{
    const category = await PRCategory.findByIdAndDelete(req.params.id);
    if(!category){
      return res.status(404).json({error:"Category not found"});
    }

    res.status(200).json({
      message:"PR Category deleted successfully"
    })

  }catch(error){
    console.log(error)
    res.status(500).json({error:"Server error"})

  }
}



module.exports = {
  createPRCategory,
  getAllPRCategories,
  getPRCategoryById,
  updatePRCategory,
  deletePRCategory
}
