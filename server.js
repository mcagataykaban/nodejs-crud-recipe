const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = 4000
var bodyParser = require('body-parser')
const { forEach } = require('methods')

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

mongoose.connect('mmongodb+srv://cagatayKaban:KENA0AZBHA6PWyca@recipe.svorc.mongodb.net/RecipeHW?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true})

const { Schema } = mongoose;

const recipeSchema = new Schema({
    name: String,
    ingredients: [],
    categoryId: [],
    time: Number,
})
const categorySchema = new Schema({
    name: String
})
const recipe = mongoose.model('recipe', recipeSchema)
const category = mongoose.model('category', categorySchema)

app.get('/recipes', (req, res) => {
    recipe.find({}, (err,docs) => {
        res.json(docs)
    })
})

app.get('/recipe/:id', (req, res) => {
  let id =req.params.id;
  recipe.findById(id,(err,doc)=>{
    if (doc != null) {
        res.json(doc)
    }else{
        res.status(400).json({'mesaj': 'Bulunamadı!'})
    }
  })
})

app.post('/addRecipe', function (req, res) {
  let newRecipe = new recipe({
      name: req.body.name,
      ingredients: req.body.ingredients,
      categoryId: req.body.categoryId,
      time : req.body.time
  })
  newRecipe.save((err,doc)=>{
      if (!err) {
          res.json(doc)
      }else{
          res.json(err)
      }
  })
})

app.post('/updateRecipe/:id', (req, res) => {
  let id = req.params.id;
  recipe.findById(id, (err,doc) => {
      console.log(doc);
      if (doc != null) {
          doc.name = req.body.name
          let eklenecek = []
          for (let i = 0; i <= req.body.ingredients.length; i++) {
              eklenecek.push(req.body.ingredients[i])
          } 
          eklenecek.forEach(element => {
              if (!doc.ingredients.includes(element)) {
                   doc.ingredients.push(element)
              }
          });
        //   doc.ingredients = req.body.ingredients;
          doc.save((err,doc)=> {
              if (!err) {
                  res.json(doc)
                  console.log(doc);
              }else{
                  res.json(err)
              }
          })
          
      }
      else{
          res.status(404)
      }
  })
})

app.post('/recipe/delete/:id', function (req, res) {
  let id = req.params.id
  recipe.deleteOne({_id:id},(err,doc)=>{
    if(doc !=null){
        if(!err){
            res.json(doc);
        }
        else{
            res.json(err);
        }
    }
    else{
        res.status(404).json({"msg":"Silinecek ürün bulunamadı"});
    }
  })
})






// var newRecipe = new recipe({
//     name: 'mercimek çorbası',
//     ingredients: ['mercimek'],
//     time: 20
// })
// newRecipe.save()
// var newCategory = new category({
//     name: 'kırmızı et'
// })
// newCategory.save()


// var sa = new deneme({
//     name: 'cagatay',
//     price: 22
// })
// sa.save()

