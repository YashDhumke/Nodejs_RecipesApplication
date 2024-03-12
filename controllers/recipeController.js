const Category = require('../models/categoryModel.js')
const Recipe = require('../models/recipeModel.js')


module.exports.getHomepage = async (req, res) =>{
    try{
        const limitnumber = 5;

        const categories = await Category.find({}).limit(limitnumber);
        const latest = await Recipe.find({}).sort({_id:-1}).limit(limitnumber);
        const thai = await Recipe.find({'category':'Thai'}).limit(limitnumber);
        const american = await Recipe.find({'category':'American'}).limit(limitnumber);
        const indian = await Recipe.find({'category':'Indian'}).limit(limitnumber);

        const food = {latest, thai, american, indian}     
        res.render('index', {categories, food});
    }catch(err){
        res.status(500).send(err.message)
    }
}

module.exports.getExploreCategories = async (req, res)=>{
    try{
        const limitnumber = 10;
        const categories = await Category.find({}).limit(limitnumber);
        res.render('categories', {categories});

    }catch(err){
        res.status(500).send(err.message)
    }
}


module.exports.getRecipe = async (req,res) =>{
  try{
    const recipe = await Recipe.findById(req.params.id);
    res.render('recipe', {recipe})
  }catch(err){
    console.log(err)
  }
}

module.exports.getRecipesByCategory = async(req, res) =>{
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });    
  }
}

module.exports.getSearchRecipes = async (req, res) =>{
   try{
    let searchTerm = req.body.searchTerm;
    let searchRecipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', {searchRecipe});

   }catch(err){
    res.status(500).send({message: err.message || "Error Occured" });
   }
}

module.exports.getExploreRecipes = async (req, res) =>{
  try{
    const limitnumber = 20;
    let latestRecipes = await Recipe.find().sort({_id:-1}).limit(limitnumber);
    res.render('latestRecipes', {latestRecipes});

  }catch(err){
    res.status(500).send({message: err.message || "Error Occured" });
  }
}

module.exports.getRandomRecipes = async (req, res) =>{
  try{
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let randomRecipe = await Recipe.findOne().skip(random).exec();
    res.render('randomRecipes', {randomRecipe});

  }catch(err){
    res.status(500).send({message: err.message || "Error Occured" });
  }
}

module.exports.getSubmitRecipe = async(req, res) =>{
  try{
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }catch(err){
    res.status(500).send({message: err.message || "Error Occured" });
  }
}

module.exports.postSubmitRecipe = async(req, res) =>{
  try{

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');  
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name:req.body.name,
      description:req.body.description,
      email:req.body.email,
      ingredients:req.body.ingredients,
      category:req.body.category,
      image:newImageName
    })

    await newRecipe.save()
    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');

  }catch(err){
    req.flash('infoErrors', err);
    res.redirect('/submit-recipe');
  }
}


// const getrecipes = async () =>{
//     try{
//         await Recipe.insertMany([
//             { 
//                         "name": "Varan Bhat",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "recipeemail@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Indian", 
//                         "image": "grilled-lobster-rolls.jpg"
//                       },
                      
                      
                      
                   
//         ]);
//     }catch(err){
//         console.log(err)
//     }
// }

// getrecipes();










// const insertData = async () =>{
//     try{
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//               },
//               {
//                 "name": "American",
//                 "image": "american-food.jpg"
//               }, 
//               {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//               },
//               {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//               }, 
//               {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//               },
//               {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//               }
//         ])
//     }catch(err){
//         console.log(err)
//     }
    
// }
// insertData();



    



